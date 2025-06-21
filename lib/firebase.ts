"use client"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6Kddy2NXjdUPQ_lSF8hL3BO65TFitqSo",
  authDomain: "bizplannaija.firebaseapp.com",
  projectId: "bizplannaija",
  storageBucket: "bizplannaija.firebasestorage.app",
  messagingSenderId: "126865553718",
  appId: "1:126865553718:web:b2c6220ddbc24424531b97",
  measurementId: "G-J2H7B67SSG",
}

// Global Firebase instances
let app: any = null
let auth: any = null
let db: any = null
let analytics: any = null
let initPromise: Promise<any> | null = null

// Initialize Firebase with proper sequencing
export const initializeFirebase = async () => {
  // Server-side guard
  if (typeof window === "undefined") {
    return null
  }

  // Return existing promise if already initializing
  if (initPromise) {
    return initPromise
  }

  // Return existing services if already initialized
  if (app && auth && db) {
    return { app, auth, db, analytics }
  }

  // Create initialization promise
  initPromise = new Promise(async (resolve, reject) => {
    try {
      // Wait for complete DOM readiness
      await new Promise<void>((resolve) => {
        if (document.readyState === "complete") {
          setTimeout(resolve, 3000) // 3 second delay for safety
        } else {
          const handleLoad = () => {
            window.removeEventListener("load", handleLoad)
            setTimeout(resolve, 3000) // 3 second delay after load
          }
          window.addEventListener("load", handleLoad)
        }
      })

      // Import Firebase modules one by one with delays
      console.log("Importing Firebase app...")
      const { initializeApp, getApps } = await import("firebase/app")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Importing Firebase auth...")
      const { getAuth } = await import("firebase/auth")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Importing Firebase firestore...")
      const { getFirestore } = await import("firebase/firestore")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Initialize Firebase App first
      console.log("Initializing Firebase app...")
      const existingApps = getApps()
      if (existingApps.length === 0) {
        app = initializeApp(firebaseConfig)
      } else {
        app = existingApps[0]
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Initialize Auth with maximum delay
      console.log("Initializing Firebase auth...")
      auth = getAuth(app)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Initialize Firestore with delay
      console.log("Initializing Firebase firestore...")
      db = getFirestore(app)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Initialize Analytics (optional, can fail)
      try {
        console.log("Initializing Firebase analytics...")
        const { getAnalytics } = await import("firebase/analytics")
        analytics = getAnalytics(app)
      } catch (analyticsError) {
        console.log("Analytics initialization failed (optional):", analyticsError)
      }

      console.log("Firebase initialization complete!")
      resolve({ app, auth, db, analytics })
    } catch (error) {
      console.error("Firebase initialization failed:", error)
      initPromise = null // Reset promise on failure
      reject(error)
    }
  })

  return initPromise
}

// Safe getters for Firebase services
export const getAuth = () => auth
export const getDb = () => db
export const getApp = () => app
export const getAnalytics = () => analytics
