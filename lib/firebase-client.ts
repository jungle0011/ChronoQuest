"use client"

import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Client-side only Firebase utilities with robust initialization
let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null
let firebaseAnalytics: any = null
let isInitialized = false
let initializationPromise: Promise<any> | null = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB6Kddy2NXjdUPQ_lSF8hL3BO65TFitqSo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bizplannaija.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bizplannaija",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bizplannaija.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "126865553718",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:126865553718:web:b2c6220ddbc24424531b97",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-J2H7B67SSG",
}

export const initializeFirebaseClient = async () => {
  // Only run on client side
  if (typeof window === "undefined") {
    return null
  }

  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise
  }

  // Return existing instance if already initialized
  if (isInitialized && firebaseApp) {
    return {
      app: firebaseApp,
      auth: firebaseAuth,
      db: firebaseDb,
      analytics: firebaseAnalytics,
    }
  }

  // Create initialization promise
  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      // Wait for DOM to be fully ready
      if (document.readyState !== "complete") {
        await new Promise((resolve) => {
          if (document.readyState === "complete") {
            resolve(void 0)
          } else {
            window.addEventListener("load", () => resolve(void 0), { once: true })
          }
        })
      }

      // Additional delay to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Dynamic imports with error handling
      const [{ initializeApp, getApps }, { getAuth }, { getFirestore }, { getAnalytics }] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
        import("firebase/firestore"),
        import("firebase/analytics"),
      ])

      // Initialize app if not already done
      const existingApps = getApps()
      if (existingApps.length === 0) {
        firebaseApp = initializeApp(firebaseConfig)
      } else {
        firebaseApp = existingApps[0]
      }

      // Wait a bit more before initializing services
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Initialize services one by one with error handling
      try {
        firebaseAuth = getAuth(firebaseApp)
      } catch (authError) {
        console.error("Auth initialization error:", authError)
        throw authError
      }

      try {
        firebaseDb = getFirestore(firebaseApp)
      } catch (dbError) {
        console.error("Firestore initialization error:", dbError)
        throw dbError
      }

      try {
        firebaseAnalytics = getAnalytics(firebaseApp)
      } catch (analyticsError) {
        console.warn("Analytics initialization failed (non-critical):", analyticsError)
        // Analytics failure is non-critical
      }

      isInitialized = true

      const services = {
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
        analytics: firebaseAnalytics,
      }

      resolve(services)
      return services
    } catch (error) {
      console.error("Firebase initialization failed:", error)
      isInitialized = false
      initializationPromise = null
      reject(error)
    }
  })

  return initializationPromise
}

export const getFirebaseServices = () => {
  if (!isInitialized) {
    return null
  }
  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb,
    analytics: firebaseAnalytics,
  }
}

export const resetFirebaseInitialization = () => {
  isInitialized = false
  initializationPromise = null
  firebaseApp = null
  firebaseAuth = null
  firebaseDb = null
  firebaseAnalytics = null
}

export async function getCurrentUserPlan(): Promise<'free' | 'basic' | 'premium'> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return 'free';

  const db = getFirestore();
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return 'free';

  const plan = userDoc.data().plan;
  if (plan === 'basic' || plan === 'premium') return plan;
  return 'free';
}
