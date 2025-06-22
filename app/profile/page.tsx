"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaArrowLeft,
  FaCalendar,
  FaGlobe,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa"
import { useToast } from '@/hooks/use-toast'
import { useAuth } from "@/contexts/AuthContext"
import type { SavedBusiness } from "@/lib/types"
import AuthGuard from "@/components/AuthGuard"
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures'
import { getCurrentUserPlan } from '@/lib/firebase-client'
import { doc, getDoc } from 'firebase/firestore'
import { initializeFirebaseClient } from '@/lib/firebase-client'

function ProfilePageContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [businesses, setBusinesses] = useState<SavedBusiness[]>([])
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isFeatureLocked } = usePlanFeatures()
  const [plan, setPlan] = useState<'free' | 'basic' | 'premium'>('free')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | null>(null)
  const [planUpdatedAt, setPlanUpdatedAt] = useState<string | null>(null)
  const [showExpiredBanner, setShowExpiredBanner] = useState(false)
  const [joinedDate, setJoinedDate] = useState<string | null>(null)
  const wasDowngraded = useRef(false)
  const [customDomain, setCustomDomain] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserBusinesses()
      getCurrentUserPlan().then(setPlan)
      setEmail(user.email || '')
      
      // Try to fetch user profile data, but don't fail if it doesn't work
      fetch(`/api/admin/users/${user.uid}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch user data')
          }
          return res.json()
        })
        .then(data => {
          setName(data.name || user.displayName || '')
          if (data.billingCycle) setBillingCycle(data.billingCycle)
          else if (user.billingCycle) setBillingCycle(user.billingCycle)
          if (data.planUpdatedAt) setPlanUpdatedAt(data.planUpdatedAt)
          else if (user.planUpdatedAt) setPlanUpdatedAt(user.planUpdatedAt)
          if (data.joinedDate) setJoinedDate(data.joinedDate)
        })
        .catch((error) => {
          console.warn('Failed to load user profile data:', error)
          // Use fallback values from user object
          setName(user.displayName || '')
          if (user.billingCycle) setBillingCycle(user.billingCycle)
          if (user.planUpdatedAt) setPlanUpdatedAt(user.planUpdatedAt)
          // Don't show error toast for this - it's not critical
        })
        .finally(() => setLoading(false))
    } else {
      // If no user, stop loading
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    // If user was downgraded to free (from paid) in this session, show banner
    if (plan === 'free' && planUpdatedAt === null && billingCycle === null && !loading) {
      if (!wasDowngraded.current) {
        setShowExpiredBanner(true)
        wasDowngraded.current = true
      }
    } else {
      setShowExpiredBanner(false)
      wasDowngraded.current = false
    }
  }, [plan, planUpdatedAt, billingCycle, loading])

  const loadUserBusinesses = async () => {
    if (!user) return
    try {
      setLoading(true)
      const response = await fetch(`/api/business?userId=${user.uid}`)
      if (!response.ok) throw new Error('Failed to load businesses')
      const userBusinesses = await response.json()
      setBusinesses(userBusinesses)
      if (userBusinesses.length > 0) {
        setSelectedBusiness(userBusinesses[0].id)
      }
    } catch (error) {
      console.error("Failed to load businesses:", error)
      toast({ title: 'Failed to load your landing pages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    if (!confirm('Are you sure you want to delete this business?')) return
    setDeletingId(id)
    try {
      const response = await fetch(`/api/business?id=${id}&userId=${user.uid}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete business')
      setBusinesses(businesses.filter(b => b.id !== id))
      toast({ title: 'Business deleted' })
    } catch (error) {
      toast({ title: 'Failed to delete business', variant: 'destructive' })
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      toast({ title: 'Failed to logout', variant: 'destructive' })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return toast({ title: 'User not found', variant: 'destructive' })
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { name } })
      })
      if (!response.ok) throw new Error('Failed to update profile')
      toast({ title: 'Profile updated!' })
      setName(name)
    } catch (err) {
      toast({ title: 'Failed to update profile', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleConnectDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBusiness || !customDomain) {
      toast({ title: 'Please select a site and enter a domain', variant: 'destructive' })
      return
    }
    setIsConnecting(true)
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBusiness,
          domain: customDomain,
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed to connect domain')
      }

      const data = await res.json()
      toast({
        title: 'Domain connection initiated!',
        description: `Please add the required DNS records to your domain provider. Verification can take up to 24 hours.`,
      })
      // Optionally, refresh businesses to show the new domain
      loadUserBusinesses()
    } catch (error: any) {
      toast({
        title: 'Error connecting domain',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Helper to calculate next renewal date
  const getRenewalDate = () => {
    if (!planUpdatedAt || !billingCycle) return null
    const date = new Date(planUpdatedAt)
    if (billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1)
    } else if (billingCycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1)
    }
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) return <div className="p-8 text-center">Loading profile...</div>

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto py-8 px-4">
        {showExpiredBanner && (
          <div className="mb-4 p-4 rounded bg-yellow-100 border border-yellow-300 text-yellow-900 text-center font-semibold flex items-center justify-between">
            <span>
              ⚠️ Your subscription has expired and you have been downgraded to the Free plan. Please renew to regain access to premium features.
            </span>
            <button
              onClick={() => setShowExpiredBanner(false)}
              className="ml-4 px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold text-xs"
              aria-label="Dismiss expiration banner"
            >
              Dismiss
            </button>
          </div>
        )}
        {plan !== 'free' && (
          <div className="mb-4 p-4 rounded bg-green-50 border border-green-200 text-green-800 text-center font-semibold">
            🎉 Upgrade successful! You are now on the {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan.
            {billingCycle && (
              <span className="ml-2">({billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})</span>
            )}
            {planUpdatedAt && billingCycle && (
              <div className="text-green-700 text-sm mt-1">
                Next renewal: {getRenewalDate() || 'N/A'}
              </div>
            )}
          </div>
        )}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Bizplannaija</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {name || user?.email}</span>
                  <Link
                    href="/create"
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Create New</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {(name || user?.email || "U").charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{name || "User"}</h1>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <FaGlobe className="w-4 h-4" />
                      <span>{businesses.length} Landing Pages</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="w-4 h-4" />
                      <span>
                        Member since {joinedDate ? formatDate(joinedDate) : 'N/A'}
                      </span>
                    </div>
                    {/* Plan Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs
                      ${plan === 'premium' ? 'bg-yellow-400 text-white' : plan === 'basic' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                      {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connect Custom Domain */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect a Custom Domain</h2>
              <p className="text-gray-600 mb-6">Link your own domain (e.g., www.mybusiness.com) to a site you've created.</p>
              <form onSubmit={handleConnectDomain} className="space-y-4">
                <div>
                  <label htmlFor="business-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a Site
                  </label>
                  <select
                    id="business-select"
                    value={selectedBusiness}
                    onChange={(e) => setSelectedBusiness(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={businesses.length === 0}
                  >
                    {businesses.length > 0 ? (
                      businesses.map(business => (
                        <option key={business.id} value={business.id}>{business.businessName}</option>
                      ))
                    ) : (
                      <option>Create a site first</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="custom-domain" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Domain Name
                  </label>
                  <input
                    type="text"
                    id="custom-domain"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., www.mycoolbusiness.com"
                  />
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-60"
                    disabled={isConnecting || businesses.length === 0}
                  >
                    {isConnecting ? <FaSpinner className="animate-spin" /> : "Connect Domain"}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaGlobe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{businesses.length}</h3>
                    <p className="text-gray-600">Landing Pages</p>
                  </div>
                </div>
              </motion.div>

              {isFeatureLocked('profileAnalytics') ? (
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center opacity-60 relative">
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-xl">
                    <span className="text-white text-xs font-semibold mb-2">Pro Feature</span>
                    <button
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                      onClick={() => window.location.href = '/checkout?plan=pro'}
                      type="button"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                  <FaChartLine className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">—</h3>
                  <p className="text-gray-600">Analytics Locked</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaChartLine className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {businesses.filter((b) => b.analytics?.views).reduce((sum, b) => sum + (b.analytics?.views || 0), 0)}
                      </h3>
                      <p className="text-gray-600">Total Views</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {isFeatureLocked('profileAnalytics') ? (
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center opacity-60 relative">
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-xl">
                    <span className="text-white text-xs font-semibold mb-2">Pro Feature</span>
                    <button
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                      onClick={() => window.location.href = '/checkout?plan=pro'}
                      type="button"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                  <FaChartLine className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">—</h3>
                  <p className="text-gray-600">Analytics Locked</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaEye className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {businesses.filter((b) => b.analytics?.leads).reduce((sum, b) => sum + (b.analytics?.leads || 0), 0)}
                      </h3>
                      <p className="text-gray-600">Total Leads</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Landing Pages Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Landing Pages</h2>
                    <p className="text-gray-600">Manage and track your business landing pages</p>
                  </div>
                  <Link
                    href="/create"
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Create New Page</span>
                  </Link>
                </div>
              </div>

              <div className="p-8">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin w-8 h-8 text-blue-600" />
                    <span className="ml-3 text-gray-600">Loading your landing pages...</span>
                  </div>
                ) : businesses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaGlobe className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Landing Pages Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first professional landing page to get started</p>
                    <Link
                      href="/create"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                    >
                      <FaPlus className="w-4 h-4" />
                      <span>Create Your First Page</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business, index) => (
                      <motion.div
                        key={business.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                      >
                        {/* Business Logo/Image */}
                        <div className="mb-4">
                          {business.logoUrl ? (
                            <Image
                              src={business.logoUrl || "/placeholder.svg"}
                              alt={business.businessName}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xl">{business.businessName.charAt(0)}</span>
                            </div>
                          )}
                        </div>

                        {/* Business Info */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.businessName}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{business.businessDescription}</p>
                          <p className="text-xs text-gray-500 mt-2">Created {formatDate(business.createdAt)}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{business.analytics?.views || 0}</div>
                            <div className="text-gray-600">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{business.analytics?.leads || 0}</div>
                            <div className="text-gray-600">Leads</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Link
                            href={`/edit/${business.id}`}
                            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                          >
                            <FaEdit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(business.id)}
                            disabled={deletingId === business.id}
                            className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm disabled:opacity-50"
                          >
                            {deletingId === business.id ? (
                              <FaSpinner className="animate-spin w-3 h-3" />
                            ) : (
                              <FaTrash className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="mt-8 p-8 bg-white rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Profile</h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfilePageContent />
    </AuthGuard>
  )
}
