"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaEye, FaArrowLeft, FaMagic, FaSpinner, FaSignOutAlt } from "react-icons/fa"
import { toast } from "react-hot-toast"
import type { BusinessFormData } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"
import ResponsivePreview from "@/components/ResponsivePreview"
import KillerFeatures from "@/components/KillerFeatures"
import StyleTemplatePreview from "@/components/StyleTemplatePreview"
import AuthGuard from "@/components/AuthGuard"
import { STYLE_TEMPLATES, COLOR_SCHEMES, FONT_STYLES, LAYOUT_STYLES } from "@/lib/design-config"
import { CloudinaryUpload } from "@/components/CloudinaryUpload"
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures'
import dynamic from "next/dynamic"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

const COLOR_PREVIEW_CLASSES: Record<string, string> = {
  blue: "bg-gradient-to-r from-blue-600 to-cyan-600",
  purple: "bg-gradient-to-r from-purple-600 to-violet-600",
  green: "bg-gradient-to-r from-green-600 to-emerald-600",
  orange: "bg-gradient-to-r from-orange-600 to-amber-600",
  red: "bg-gradient-to-r from-red-600 to-rose-600",
  gold: "bg-gradient-to-r from-yellow-500 to-amber-400",
  teal: "bg-gradient-to-r from-teal-500 to-cyan-400",
  rose: "bg-gradient-to-r from-rose-400 to-pink-400",
  slate: "bg-gradient-to-r from-slate-600 to-gray-600",
  rainbow: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
};

function CreatePageContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { isFeatureLocked } = usePlanFeatures()

  const [formData, setFormData] = useState<BusinessFormData>({
    fullName: user?.displayName || "",
    businessName: "",
    businessDescription: "",
    productDescription: "",
    location: "",
    businessPlan: "",
    logoUrl: "",
    ownerPictureUrl: "",
    siteStyle: "modern",
    colorScheme: "blue",
    fontStyle: "modern",
    layoutStyle: "centered",
    contactOption: "whatsapp",
    contactNumber: "",
    interestedInPremium: false,
    language: "en",
    showMap: false,
    whatsappSettings: {
      welcomeMessage: "Hello! How can we help you today?",
      businessHours: true,
      autoReply: true,
      chatPosition: "bottom-right",
    },
    enableAI: false,
    enableAnalytics: true,
    enableSEO: true,
    enableLeadCapture: true,
    enableBooking: true,
    enableReviews: true,
    socialLinks: {},
    businessHours: {},
    keywords: [],
    featuresEnabled: false,
    features: [],
    products: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleNestedChange = <
    T extends keyof BusinessFormData,
    K extends keyof NonNullable<BusinessFormData[T]>
  >(
    section: T,
    key: K,
    value: NonNullable<BusinessFormData[T]>[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as any) || {}),
        [key]: value,
      },
    }))
  }

  const handleLogoUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: url,
    }))
  }

  const handleOwnerPictureUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      ownerPictureUrl: url,
    }))
  }

  const handleStyleChange = (
    key: "siteStyle" | "colorScheme" | "fontStyle" | "layoutStyle",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleKeywordChange = (keywords: string[]) => {
    setFormData((prev) => ({
      ...prev,
      keywords,
    }))
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid, formData }),
      })
      if (res.ok) {
        toast.success("🎉 Landing page created successfully!")
        router.push("/profile")
      } else {
        const data = await res.json()
        const errorMessage = data.details ? `${data.error}: ${data.details.join(', ')}` : data.error
        toast.error(errorMessage || "Failed to create landing page. Please try again.")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create your landing page. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <AuthGuard>{null}</AuthGuard>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">Bizplannaija</span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                <FaEye className="w-4 h-4" />
                <span>{showPreview ? "Hide" : "Show"} Preview</span>
              </button>
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
        <div className={`grid ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-8 h-[calc(100vh-200px)]`}>
          {/* Form Section - Scrollable */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* Form Header - Fixed */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
              <div className="flex items-center space-x-3">
                <FaMagic className="w-6 h-6" />
                <div>
                  <h1 className="text-2xl font-bold">Create Your Landing Page</h1>
                  <p className="text-orange-100">Enter your business information and design settings</p>
                </div>
              </div>
            </div>
            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-8 p-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Business Information</h3>
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      What does your business do? *
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      required
                      rows={3}
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe what your business does"
                    />
                  </div>
                  <div>
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Description *
                    </label>
                    <textarea
                      id="productDescription"
                      name="productDescription"
                      required
                      rows={3}
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe your main product or service"
                    />
                  </div>
                  {/* Products (Premium) */}
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-semibold text-gray-900">Our Products & Services</h4>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        disabled={!!formData.products && formData.products.length >= 5}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            products: [...(prev.products || []), { name: '', description: '', imageUrl: '' }].slice(0, 5)
                          }))
                        }}
                      >
                        Add Product
                      </button>
                    </div>
                    {(formData.products || []).map((product, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-2 items-start md:items-center border rounded-lg p-3 bg-gray-50">
                        <div className="flex flex-col items-center mr-2">
                          <CloudinaryUpload
                            onUpload={url => {
                              const products = formData.products ? [...formData.products] : [];
                              products[idx] = { ...products[idx], imageUrl: url };
                              setFormData(prev => ({ ...prev, products }));
                            }}
                            folder="products"
                          />
                          {product.imageUrl && (
                            <Image
                              src={product.imageUrl}
                              alt="Product preview"
                              width={120}
                              height={120}
                              className="rounded object-cover mt-2 w-32 h-32"
                            />
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={product.name}
                          onChange={e => {
                            const products = formData.products ? [...formData.products] : [];
                            products[idx] = { ...products[idx], name: e.target.value };
                            setFormData(prev => ({ ...prev, products }));
                          }}
                          className="flex-1 p-2 rounded border"
                        />
                        <input
                          type="text"
                          placeholder="Product Description"
                          value={product.description}
                          onChange={e => {
                            const products = formData.products ? [...formData.products] : [];
                            products[idx] = { ...products[idx], description: e.target.value };
                            setFormData(prev => ({ ...prev, products }));
                          }}
                          className="flex-1 p-2 rounded border"
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:underline text-xs mt-2 md:mt-0"
                          onClick={() => {
                            const products = formData.products ? [...formData.products] : [];
                            products.splice(idx, 1);
                            setFormData(prev => ({ ...prev, products }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location (City/State) *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>
                  <div>
                    <label htmlFor="businessPlan" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Plan Summary
                    </label>
                    <textarea
                      id="businessPlan"
                      name="businessPlan"
                      rows={4}
                      value={formData.businessPlan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief summary of your business plan (optional)"
                    />
                  </div>
                </div>
                {/* Logo Upload with Cloudinary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Logo & Branding</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <CloudinaryUpload
                          onUpload={handleLogoUpload}
                          folder="logos"
                        />
                        {isFeatureLocked && isFeatureLocked('logoUpload') && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-lg">
                            <span className="text-white text-xs font-semibold mb-2">Pro Feature</span>
                            <button
                              className="bg-purple-600 text-white px-3 py-1 rounded"
                              onClick={() => window.location.href = '/checkout?plan=pro'}
                              type="button"
                            >
                              Upgrade to Pro
                            </button>
                          </div>
                        )}
                      </div>
                      {formData.logoUrl && (
                        <div className="flex items-center space-x-2">
                          <Image
                            src={formData.logoUrl}
                            alt="Logo preview"
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                          <span className="text-sm text-green-600">Logo uploaded!</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Owner's Picture Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Owner's Picture</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <CloudinaryUpload
                          onUpload={handleOwnerPictureUpload}
                          folder="owners"
                        />
                        {isFeatureLocked && isFeatureLocked('ownerUpload') && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-full">
                            <span className="text-white text-xs font-semibold mb-2">Pro Feature</span>
                            <button
                              className="bg-purple-600 text-white px-3 py-1 rounded"
                              onClick={() => window.location.href = '/checkout?plan=pro'}
                              type="button"
                            >
                              Upgrade to Pro
                            </button>
                          </div>
                        )}
                      </div>
                      {formData.ownerPictureUrl && (
                        <div className="flex items-center space-x-2">
                          <Image
                            src={formData.ownerPictureUrl}
                            alt="Owner's picture preview"
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                          <span className="text-sm text-green-600">Owner's picture uploaded!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Design & Style Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">🎨 Design & Style</h3>
                  {/* Style Template */}
                  <div>
                    <label htmlFor="siteStyle" className="block text-sm font-medium text-gray-700 mb-4">
                      Choose Style Template *
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-8 h-6 rounded mr-2 inline-block align-middle ${STYLE_TEMPLATES[formData.siteStyle]?.bg}`}></span>
                            {STYLE_TEMPLATES[formData.siteStyle]?.name || 'Select a style'}
                          </span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.entries(STYLE_TEMPLATES).map(([key, style]) => (
                          <DropdownMenuItem
                            key={key}
                            onSelect={() => setFormData(prev => ({ ...prev, siteStyle: key as any }))}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <span className={`w-8 h-6 rounded mr-2 inline-block align-middle ${style.bg}`}></span>
                            <span>{style.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Color Scheme */}
                  <div>
                    <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-700 mb-3">
                      Color Scheme *
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full inline-block mr-2 ${COLOR_PREVIEW_CLASSES[formData.colorScheme]}`}></span>
                            {COLOR_SCHEMES[formData.colorScheme]?.name || 'Select a color'}
                          </span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                          <DropdownMenuItem
                            key={key}
                            onSelect={() => setFormData(prev => ({ ...prev, colorScheme: key as any }))}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <span className={`w-5 h-5 rounded-full inline-block mr-2 ${COLOR_PREVIEW_CLASSES[key]}`}></span>
                            <span>{scheme.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Font Style */}
                  <div>
                    <label htmlFor="fontStyle" className="block text-sm font-medium text-gray-700 mb-3">
                      Typography Style *
                    </label>
                    <select
                      name="fontStyle"
                      value={formData.fontStyle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {Object.entries(FONT_STYLES).map(([key, font]) => (
                        <option key={key} value={key}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Layout Style */}
                  <div>
                    <label htmlFor="layoutStyle" className="block text-sm font-medium text-gray-700 mb-3">
                      Layout Style *
                    </label>
                    <select
                      name="layoutStyle"
                      value={formData.layoutStyle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {Object.entries(LAYOUT_STYLES).map(([key, layout]) => (
                        <option key={key} value={key}>{layout.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Killer Features */}
                <KillerFeatures formData={formData} setFormData={setFormData} />
                {/* Contact & WhatsApp Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact & WhatsApp</h3>
                  <div>
                    <label htmlFor="contactOption" className="block text-sm font-medium text-gray-700 mb-2">Contact Option</label>
                    <select
                      id="contactOption"
                      name="contactOption"
                      value={formData.contactOption}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="whatsapp">WhatsApp Only</option>
                      <option value="call">Phone Call Only</option>
                      <option value="both">Both WhatsApp & Call</option>
                      <option value="none">No Contact Button</option>
                    </select>
                  </div>
                  {['whatsapp', 'call', 'both'].includes(formData.contactOption) && (
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.contactOption === "whatsapp" ? "WhatsApp Number" : "Phone Number"} *
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        required={true}
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., +234 801 234 5678"
                      />
                    </div>
                  )}
                </div>
                {/* Business Features */}
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <span>Business Features</span>
                    <span className="text-xs text-gray-500 font-normal">(Optional, shown as cards on your site)</span>
                  </h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!formData.featuresEnabled}
                      onChange={e => setFormData(prev => ({ ...prev, featuresEnabled: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Show feature cards on my site</span>
                  </label>
                  {formData.featuresEnabled && (
                    <div className="space-y-4">
                      {[0, 1, 2].map(idx => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center border rounded-lg p-4 bg-gray-50">
                          <select
                            value={formData.features?.[idx]?.icon || ''}
                            onChange={e => {
                              const features = formData.features ? [...formData.features] : [];
                              features[idx] = { ...features[idx], icon: e.target.value };
                              setFormData(prev => ({ ...prev, features }));
                            }}
                            className="w-32 p-2 rounded border"
                          >
                            <option value="">Select Icon</option>
                            <option value="FaTruck">🚚 Fast Delivery</option>
                            <option value="FaHeadset">🎧 24/7 Support</option>
                            <option value="FaLock">🔒 Secure Payment</option>
                            <option value="FaAward">🏆 Award-Winning</option>
                            <option value="FaUndo">↩️ Money-Back Guarantee</option>
                            <option value="FaLeaf">🌱 Eco-Friendly</option>
                            <option value="FaCogs">⚙️ Custom Solutions</option>
                            <option value="FaUsers">👥 Trusted by Many</option>
                            <option value="FaStar">⭐ Premium Quality</option>
                            <option value="FaCalendarCheck">📅 Easy Booking</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Feature Title"
                            value={formData.features?.[idx]?.title || ''}
                            onChange={e => {
                              const features = formData.features ? [...formData.features] : [];
                              features[idx] = { ...features[idx], title: e.target.value };
                              setFormData(prev => ({ ...prev, features }));
                            }}
                            className="flex-1 p-2 rounded border"
                          />
                          <input
                            type="text"
                            placeholder="Short Description"
                            value={formData.features?.[idx]?.description || ''}
                            onChange={e => {
                              const features = formData.features ? [...formData.features] : [];
                              features[idx] = { ...features[idx], description: e.target.value };
                              setFormData(prev => ({ ...prev, features }));
                            }}
                            className="flex-1 p-2 rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const features = formData.features ? [...formData.features] : [];
                              features.splice(idx, 1);
                              setFormData(prev => ({ ...prev, features }));
                            }}
                            className="text-red-500 hover:underline text-xs mt-2 sm:mt-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <FaSpinner className="animate-spin inline-block mr-2" /> : null}
                    Create Landing Page
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
          {/* Live Preview Section */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-xl font-bold">Live Preview</h2>
                <p className="text-blue-100">See how your landing page will look</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ResponsivePreview formData={formData} />
                {formData.showMap && formData.location && (
                  <div className="my-4">
                    <LeafletMap location={formData.location} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CreatePage() {
  return <CreatePageContent />
}