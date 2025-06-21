"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
