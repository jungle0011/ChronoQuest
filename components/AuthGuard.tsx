"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { FaSpinner } from "react-icons/fa"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push("/login")
    }
  }, [user, loading, requireAuth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
