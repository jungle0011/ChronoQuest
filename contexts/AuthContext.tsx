"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { initializeFirebaseClient } from "@/lib/firebase-client"
import { doc, setDoc } from "firebase/firestore"

interface User {
  uid: string
  email: string
  displayName?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  initialized: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initialized: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let isMounted = true
    setLoading(true)
    setError(null)
    console.log('[AuthProvider] Starting Firebase initialization...')
    let timeout = setTimeout(() => {
      if (isMounted) {
        setError('Firebase initialization timed out. Please check your network and Firebase config.')
        setLoading(false)
        setInitialized(true)
        console.error('[AuthProvider] Firebase initialization timed out.')
      }
    }, 10000)
    initializeFirebaseClient().then(() => {
      if (!isMounted) return
      console.log('[AuthProvider] Firebase initialized.')
      const auth = getAuth()
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!isMounted) return
        clearTimeout(timeout)
        console.log('[AuthProvider] onAuthStateChanged fired:', firebaseUser)
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
          })
        } else {
          setUser(null)
        }
        setLoading(false)
        setInitialized(true)
      })
    }).catch((initError) => {
      if (!isMounted) return
      clearTimeout(timeout)
      setError("Failed to initialize Firebase: " + (initError?.message || initError))
      setLoading(false)
      setInitialized(true)
      console.error('[AuthProvider] Firebase initialization error:', initError)
    })
    return () => {
      isMounted = false
      clearTimeout(timeout)
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const firebaseServices = await initializeFirebaseClient()
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Update Firestore user document with real email and displayName
      if (firebaseServices?.db) {
        const user = userCredential.user
        await setDoc(doc(firebaseServices.db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: user.displayName || '',
          updatedAt: new Date(),
        }, { merge: true })
      }
    } catch (error: any) {
      setError(error.message || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, displayName?: string) => {
    setError(null)
    setLoading(true)
    try {
      const firebaseServices = await initializeFirebaseClient()
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      // Update Firestore user document with real email and displayName
      if (firebaseServices?.db) {
        const user = userCredential.user
        await setDoc(doc(firebaseServices.db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: displayName || user.displayName || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }, { merge: true })
      }
    } catch (error: any) {
      setError(error.message || "Signup failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    setLoading(true)
    try {
      await initializeFirebaseClient()
      const auth = getAuth()
      await signOut(auth)
    } catch (error: any) {
      setError(error.message || "Logout failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    initialized,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
