"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FaRobot,
  FaChartLine,
  FaSearch,
  FaCalendarAlt,
  FaGlobe,
  FaEnvelope,
  FaMagic,
  FaRocket,
  FaUsers,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaLanguage,
} from "react-icons/fa"
import type { BusinessFormData } from "@/lib/types"
import { generateBusinessContent, generateCustomerReviews } from "@/lib/ai-content"
import { languages } from "@/lib/translations"
import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures'
import { FeatureLock } from '@/components/FeatureLock'
import { toast } from 'react-hot-toast'

interface KillerFeaturesProps {
  formData: BusinessFormData
  setFormData: (data: BusinessFormData | ((prev: BusinessFormData) => BusinessFormData)) => void
}

function KillerFeatures({ formData, setFormData }: KillerFeaturesProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [isGeneratingReviews, setIsGeneratingReviews] = useState(false)
  const { isFeatureLocked, getUpgradeMessage, plan } = usePlanFeatures()

  const handleAIGenerate = async () => {
    if (isFeatureLocked('aiContentGenerator')) {
      toast.error(getUpgradeMessage('AI Content Generator'));
      return;
    }

    if (!formData.businessName) {
      alert("Please enter your business name first!")
      return
    }

    setIsGeneratingAI(true)
    try {
      const aiContent = await generateBusinessContent(formData.businessName, formData.businessDescription)
      setFormData((prev) => ({
        ...prev,
        businessDescription: aiContent.businessDescription || prev.businessDescription,
        productDescription: aiContent.productDescription || prev.productDescription,
        businessPlan: aiContent.businessPlan || prev.businessPlan,
        metaTitle: aiContent.metaTitle || prev.metaTitle,
        metaDescription: aiContent.metaDescription || prev.metaDescription,
        keywords: aiContent.keywords || prev.keywords,
        enableAI: true,
      }))
    } catch (error) {
      console.error("AI generation failed:", error)
      alert("AI generation failed. Please try again.")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleReviewsGenerate = async () => {
    if (isFeatureLocked('aiContentGenerator')) {
      toast.error(getUpgradeMessage('AI Review Generator'));
      return;
    }

    if (!formData.businessName) {
      alert("Please enter your business name first!")
      return
    }

    setIsGeneratingReviews(true)
    try {
      const aiReviews = await generateCustomerReviews(formData.businessName, formData.businessDescription, 6)
      setFormData((prev) => ({
        ...prev,
        aiGeneratedReviews: aiReviews,
        enableReviews: true,
      }))
    } catch (error) {
      console.error("Review generation failed:", error)
      alert("Review generation failed. Please try again.")
    } finally {
      setIsGeneratingReviews(false)
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    const backendKey = featureKeyMap[featureId] || featureId;
    if (isFeatureLocked(backendKey as any)) {
      toast.error(getUpgradeMessage(featureId));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [featureId]: !prev[featureId as keyof BusinessFormData],
    }));
  };

  const killerFeatures = [
    {
      id: "enableAI",
      icon: <FaRobot className="w-6 h-6" />,
      title: "🤖 AI Content Generator",
      description: "Let AI write your business content, descriptions, and SEO copy",
      premium: true,
      action: handleAIGenerate,
      actionText: isGeneratingAI ? "Generating..." : "Generate with AI",
    },
    {
      id: "enableReviews",
      icon: <FaUsers className="w-6 h-6" />,
      title: "⭐ AI Review Generator",
      description: "Generate authentic customer testimonials and reviews",
      premium: true,
      action: handleReviewsGenerate,
      actionText: isGeneratingReviews ? "Generating..." : "Generate Reviews",
    },
    {
      id: "enableAnalytics",
      icon: <FaChartLine className="w-6 h-6" />,
      title: "📊 Real-time Analytics",
      description: "Track visitors, clicks, leads, and performance metrics",
      premium: true,
    },
    {
      id: "enableSEO",
      icon: <FaSearch className="w-6 h-6" />,
      title: "🚀 SEO Optimization",
      description: "Auto-optimized for Google search with meta tags and keywords",
      premium: true,
    },
    {
      id: "enableLeadCapture",
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "💼 Lead Capture Forms",
      description: "Collect customer emails and inquiries automatically",
      premium: true,
    },
    {
      id: "enableBooking",
      icon: <FaCalendarAlt className="w-6 h-6" />,
      title: "📅 Appointment Booking",
      description: "Let customers book appointments via WhatsApp",
      premium: true,
    },
    {
      id: "showMap",
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "🗺️ Google Maps Integration",
      description: "Show your location with interactive maps and directions",
      premium: true,
    },
  ]

  // Plan-based feature access logic
  const isPremium = plan === 'premium';
  const isBasic = plan === 'basic';

  function isFeatureUnlocked(featureId: string) {
    // AI Content Generator and Lead Capture: Basic and Premium
    if (["enableAI", "enableLeadCapture"].includes(featureId)) {
      return isBasic || isPremium;
    }
    // All others: Premium only
    return isPremium;
  }

  // Map UI feature ids to backend feature keys
  const featureKeyMap: Record<string, string> = {
    enableAI: 'aiContentGenerator',
    enableReviews: 'aiContentGenerator', // reviews are gated by AI
    enableAnalytics: 'realTimeAnalytics',
    enableSEO: 'socialMediaAndSeo',
    enableLeadCapture: 'leadCapture',
    enableBooking: 'appointmentBooking',
    showMap: 'languageAndLocation',
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4"
        >
          <FaMagic className="w-4 h-4 text-purple-600" />
          <span className="text-purple-800 font-semibold">Killer Features</span>
          <FaRocket className="w-4 h-4 text-purple-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Supercharge Your Landing Page</h3>
        <p className="text-gray-600">Add powerful features that convert visitors into customers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {killerFeatures.map((feature, index) => {
          const backendKey = featureKeyMap[feature.id] || feature.id;
          const locked = feature.premium && isFeatureLocked(backendKey as any);
          return (
            <FeatureLock key={feature.id} featureId={backendKey} message={locked ? getUpgradeMessage(feature.title) : ''}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  formData[feature.id as keyof BusinessFormData]
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${feature.premium ? "bg-gradient-to-br from-yellow-50 to-orange-50" : ""}`}
                onClick={() => {
                  if (!feature.action && !locked) {
                    handleFeatureToggle(feature.id);
                  }
                }}
              >
                {feature.premium && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    PRO
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      formData[feature.id as keyof BusinessFormData]
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>

                    {feature.action && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          feature.action!()
                        }}
                        disabled={isGeneratingAI || isGeneratingReviews}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
                      >
                        {feature.actionText}
                      </button>
                    )}
                  </div>
                </div>

                {formData[feature.id as keyof BusinessFormData] && !feature.action && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            </FeatureLock>
          );
        })}
      </div>

      {/* Language & Location Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FaLanguage className="w-5 h-5 text-blue-600" />
          <span>Language & Location Settings</span>
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website Language</label>
            <select
              value={formData.language || "en"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  language: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(languages).map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Address (Optional)</label>
            <input
              type="text"
              value={formData.fullAddress || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fullAddress: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Complete address for better map accuracy"
            />
          </div>
        </div>
      </motion.div>

      {/* Social Media Links */}
      {(formData.enableSEO || formData.enableAnalytics) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaGlobe className="w-5 h-5 text-blue-600" />
            <span>Social Media & SEO</span>
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page URL</label>
              <input
                type="url"
                value={formData.socialLinks.facebook || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
              <input
                type="text"
                value={formData.socialLinks.instagram || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="@yourbusiness"
              />
            </div>

            {formData.enableSEO && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Business - Best Service in Your City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description for search engines..."
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Business Hours */}
      {formData.enableBooking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaCalendarAlt className="w-5 h-5 text-green-600" />
            <span>Business Hours</span>
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <div key={day}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{day}</label>
                <input
                  type="text"
                  value={formData.businessHours[day.toLowerCase() as keyof typeof formData.businessHours] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessHours: {
                        ...prev.businessHours,
                        [day.toLowerCase()]: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="9:00 AM - 5:00 PM"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* WhatsApp Settings */}
      {formData.contactOption !== "none" && formData.contactOption !== "call" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FaWhatsapp className="w-5 h-5 text-green-600" />
            <span>WhatsApp Chat Widget Settings</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
              <textarea
                rows={2}
                value={formData.whatsappSettings?.welcomeMessage || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    whatsappSettings: {
                      ...prev.whatsappSettings,
                      welcomeMessage: e.target.value,
                      businessHours: prev.whatsappSettings?.businessHours || true,
                      autoReply: prev.whatsappSettings?.autoReply || true,
                      chatPosition: prev.whatsappSettings?.chatPosition || "bottom-right",
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={`Hi! Welcome to ${formData.businessName || "your business"}. How can we help you today?`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showBusinessHours"
                  checked={formData.whatsappSettings?.businessHours || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whatsappSettings: {
                        ...prev.whatsappSettings,
                        welcomeMessage: prev.whatsappSettings?.welcomeMessage || "",
                        businessHours: e.target.checked,
                        autoReply: prev.whatsappSettings?.autoReply || true,
                        chatPosition: prev.whatsappSettings?.chatPosition || "bottom-right",
                      },
                    }))
                  }
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="showBusinessHours" className="text-sm font-medium text-gray-700">
                  Show business hours in chat
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoReply"
                  checked={formData.whatsappSettings?.autoReply || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whatsappSettings: {
                        ...prev.whatsappSettings,
                        welcomeMessage: prev.whatsappSettings?.welcomeMessage || "",
                        businessHours: prev.whatsappSettings?.businessHours || true,
                        autoReply: e.target.checked,
                        chatPosition: prev.whatsappSettings?.chatPosition || "bottom-right",
                      },
                    }))
                  }
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="autoReply" className="text-sm font-medium text-gray-700">
                  Show "We reply instantly" message
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chat Widget Position</label>
              <select
                value={formData.whatsappSettings?.chatPosition || "bottom-right"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    whatsappSettings: {
                      ...prev.whatsappSettings,
                      welcomeMessage: prev.whatsappSettings?.welcomeMessage || "",
                      businessHours: prev.whatsappSettings?.businessHours || true,
                      autoReply: prev.whatsappSettings?.autoReply || true,
                      chatPosition: e.target.value as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Default export
export default KillerFeatures
