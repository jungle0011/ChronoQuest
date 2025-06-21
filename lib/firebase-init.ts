"use client"

import { firebaseConfig } from "./firebase-config"

// Global Firebase state
let firebaseInitialized = false
let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null
let initPromise: Promise<any> | null = null

// Safe Firebase initialization with maximum error handling
export const initializeFirebase = async (): Promise<{
  app: any
  auth: any
  db: any
} | null> => {
  // Server-side guard
  if (typeof window === "undefined") {
    return null
  }

  // Return existing services if already initialized
  if (firebaseInitialized && firebaseApp && firebaseAuth && firebaseDb) {
    return {
      app: firebaseApp,
      auth: firebaseAuth,
      db: firebaseDb,
    }
  }

  // Return existing promise if initialization is in progress
  if (initPromise) {
    return initPromise
  }

  // Create new initialization promise
  initPromise = new Promise(async (resolve) => {
    try {
      // Wait for window to be fully loaded
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (document.readyState === "complete") {
              resolve()
            } else {
              setTimeout(checkReady, 50)
            }
          }
          checkReady()
        })
      }

      // Additional safety delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Import Firebase modules with error handling
      let FirebaseApp, FirebaseAuth, FirebaseFirestore

      try {
        FirebaseApp = await import("firebase/app")
        FirebaseAuth = await import("firebase/auth")
        FirebaseFirestore = await import("firebase/firestore")
      } catch (importError) {
        console.error("Failed to import Firebase modules:", importError)
        resolve(null)
        return
      }

      // Initialize Firebase App
      try {
        const existingApps = FirebaseApp.getApps()
        if (existingApps.length > 0) {
          firebaseApp = existingApps[0]
        } else {
          firebaseApp = FirebaseApp.initializeApp(firebaseConfig)
        }
      } catch (appError) {
        console.error("Failed to initialize Firebase App:", appError)
        resolve(null)
        return
      }

      // Wait before initializing services
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Initialize Auth
      try {
        firebaseAuth = FirebaseAuth.getAuth(firebaseApp)
        // Wait for auth to be ready
        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (authError) {
        console.error("Failed to initialize Firebase Auth:", authError)
        resolve(null)
        return
      }

      // Initialize Firestore
      try {
        firebaseDb = FirebaseFirestore.getFirestore(firebaseApp)
        // Wait for firestore to be ready
        await new Promise((resolve) => setTimeout(resolve, 200))
      } catch (dbError) {
        console.error("Failed to initialize Firestore:", dbError)
        resolve(null)
        return
      }

      // Mark as initialized
      firebaseInitialized = true

      const services = {
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
      }

      resolve(services)
    } catch (error) {
      console.error("Firebase initialization failed:", error)
      resolve(null)
    }
  })

  return initPromise
}

// Get Firebase services (returns null if not initialized)
export const getFirebaseServices = () => {
  if (!firebaseInitialized || !firebaseApp || !firebaseAuth || !firebaseDb) {
    return null
  }
  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb,
  }
}

// Reset Firebase (for testing/debugging)
export const resetFirebase = () => {
  firebaseInitialized = false
  firebaseApp = null
  firebaseAuth = null
  firebaseDb = null
  initPromise = null
}
