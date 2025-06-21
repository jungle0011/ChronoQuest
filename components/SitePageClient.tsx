"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaClock,
  FaCheckCircle,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaTruck,
  FaHeadset,
  FaLock,
  FaAward,
  FaUndo,
  FaLeaf,
  FaCogs,
  FaUsers,
  FaCalendarCheck,
} from "react-icons/fa"
import { STYLE_TEMPLATES, COLOR_SCHEMES, FONT_STYLES, LAYOUT_STYLES } from "@/lib/design-config"
import type { SavedBusiness } from "@/lib/types"
import { getTranslation } from "@/lib/translations"
import LanguageSelector from "./LanguageSelector"
import WhatsAppWidget from "./WhatsAppWidget"
import dynamic from "next/dynamic"
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false })
import AnalyticsDashboard from "./AnalyticsDashboard"
import { initializeFirebaseClient } from "@/lib/firebase-client"
import { doc, onSnapshot } from "firebase/firestore"
import { HOMEPAGE_THEMES } from '@/lib/homepage-themes'

interface SitePageClientProps {
  business: SavedBusiness
}

export default function SitePageClient({ business }: SitePageClientProps) {
  const [currentLanguage, setCurrentLanguage] = useState(business.language || "en")
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [ownerPlan, setOwnerPlan] = useState<'free' | 'basic' | 'premium'>('free')
  const [logoError, setLogoError] = useState(false)

  const styleTemplate = STYLE_TEMPLATES[business.siteStyle] || STYLE_TEMPLATES.modern
  const colorScheme = COLOR_SCHEMES[business.colorScheme] || COLOR_SCHEMES.blue
  const fontStyle = FONT_STYLES[business.fontStyle] || FONT_STYLES.modern
  const layoutStyle = LAYOUT_STYLES[business.layoutStyle] || LAYOUT_STYLES.centered

  // Combine style configurations
  const combinedStyles = {
    bg: business.colorScheme === "dark" ? colorScheme.bg : styleTemplate.bg,
    primary: colorScheme.primary,
    secondary: colorScheme.secondary,
    accent: colorScheme.accent,
    text: business.colorScheme === "dark" ? colorScheme.text : styleTemplate.text,
    hover: colorScheme.hover,
  }

  const isDark = business.colorScheme === "dark"

  // Use AI generated reviews if available, otherwise use sample reviews
  const reviews = business.aiGeneratedReviews || [
    { name: "Sarah Johnson", rating: 5, comment: "Excellent service! Highly recommended.", verified: true },
    { name: "Michael Chen", rating: 5, comment: "Professional and reliable. Will use again.", verified: true },
    { name: "Aisha Okafor", rating: 4, comment: "Great experience, very satisfied.", verified: false },
  ]

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi! I'm interested in ${business.businessName}. Can you tell me more?`)
    const whatsappUrl = `https://wa.me/${business.contactNumber.replace(/\D/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCallClick = () => {
    window.location.href = `tel:${business.contactNumber}`
  }

  const handleBookingClick = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to book an appointment at ${business.businessName}. Please let me know your available times. Thank you!`,
    )
    const whatsappUrl = `https://wa.me/${business.contactNumber?.replace(/\D/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  useEffect(() => {
    if (!business.userId) return
    
    // Set plan based on business data instead of real-time listener
    if (business.interestedInPremium) {
      setOwnerPlan('premium')
    } else {
      setOwnerPlan('free')
    }
  }, [business.userId, business.interestedInPremium])

  useEffect(() => {
    setLogoError(false)
  }, [business.logoUrl])

  // Homepage theme logic
  const homepageTheme = (business.homepageThemes && business.activeHomepageThemeId)
    ? business.homepageThemes.find(t => t.id === business.activeHomepageThemeId) || HOMEPAGE_THEMES[0]
    : HOMEPAGE_THEMES[0];

  // Determine which sections to show in the nav
  const navSections = [
    { id: "home", label: "Home" },
    ...(business.productDescription || (business.products && business.products.length > 0)
      ? [{ id: "services", label: "Products & Services" }] : []),
    ...((business.contactNumber && business.contactOption !== "none")
      ? [{ id: "contact", label: "Contact" }] : []),
  ]

  return (
    <div className={`min-h-screen ${combinedStyles.bg} ${fontStyle.className}`}>
      {/* Mobile-First Header */}
      <motion.header
        className={`flex items-center h-auto`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`flex items-center justify-between w-full gap-2 py-0 mb-0 items-center bg-white shadow-sm sticky top-0 z-40`}>
          <div className="flex items-center space-x-3 flex-shrink-0 m-0 p-0 items-center">
            {business.logoUrl && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Image
                  src={business.logoUrl || "/placeholder.svg"}
                  alt={`${business.businessName} logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl object-cover shadow-lg"
                />
              </motion.div>
            )}
            <div className="min-w-0 flex-1">
              <motion.h1
                className={`text-lg font-bold ${combinedStyles.text} truncate leading-[1] m-0 p-0`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {business.businessName}
              </motion.h1>
              <motion.p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} truncate leading-[1] m-0 p-0`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                by {business.fullName}
              </motion.p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end min-w-0">
            <div className="flex overflow-x-auto scrollbar-hide space-x-2 md:space-x-4 min-w-0 max-w-md m-0 p-0">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const el = document.getElementById(section.id);
                    if (el) {
                      const header = document.querySelector('header.sticky') as HTMLElement | null;
                      const headerHeight = header ? header.offsetHeight : 80;
                      const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8; // 8px gap
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className={`whitespace-nowrap px-4 py-0 m-0 rounded-lg font-medium transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary leading-[1]`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          {/* Language Selector - Hidden on mobile, shown in menu */}
          <div className="hidden sm:block">
            <div className="text-gray-700">
              <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={(lang) => setCurrentLanguage(lang as 'en' | 'yo' | 'ig' | 'ha')} />
            </div>
          </div>

          {/* Premium Badge */}
          {business.interestedInPremium && (
            <motion.span
              className={`bg-gradient-to-r ${combinedStyles.primary} text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaStar className="w-3 h-3" />
              <span className="hidden sm:inline">PREMIUM</span>
            </motion.span>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`sm:hidden p-2 rounded-lg ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors duration-200`}
          >
            {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-4">
              {/* Language Selector */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${combinedStyles.text}`}>Language</span>
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={(lang) => setCurrentLanguage(lang as 'en' | 'yo' | 'ig' | 'ha')}
                />
              </div>

              {/* Analytics Toggle */}
              {business.enableAnalytics && (ownerPlan === 'basic' || ownerPlan === 'premium') && (
                <button
                  onClick={() => {
                    setShowAnalytics(!showAnalytics)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  📊 {showAnalytics ? "Hide" : "Show"} Analytics
                </button>
              )}

              {/* Quick Contact */}
              {business.contactNumber && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleWhatsAppClick()
                      setMobileMenuOpen(false)
                    }}
                    className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      handleCallClick()
                      setMobileMenuOpen(false)
                    }}
                    className={`flex-1 bg-gradient-to-r ${combinedStyles.primary} text-white px-3 py-2 rounded-lg text-sm font-medium ${combinedStyles.hover} transition-colors duration-200 flex items-center justify-center space-x-2`}
                  >
                    <FaPhone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Analytics Dashboard */}
      {showAnalytics && business.enableAnalytics && (ownerPlan === 'basic' || ownerPlan === 'premium') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 border-b border-gray-200"
        >
          <div className={`${layoutStyle.className} px-4 sm:px-6 lg:px-8 py-8`}>
            <AnalyticsDashboard businessId={business.id} analytics={business.analytics} />
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative h-[100vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Homepage theme background */}
        <div className={`absolute inset-0 ${homepageTheme.heroBgClass}`} />
        {/* Animated, more vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-gradient-slow" />
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center max-w-xl min-h-[400px] mx-auto text-center">
            {/* Logo and Business Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-8 group"
            >
              <div className="relative w-24 h-24 sm:w-30 sm:h-30 mx-auto mb-4 flex items-center justify-center">
                {/* Soft glow behind logo, intensifies on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300/40 to-purple-300/40 blur-2xl z-0"
                  whileHover={{ opacity: 1, scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />
                {business.logoUrl && !logoError ? (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative z-10"
                  >
                    <Image
                      src={business.logoUrl}
                      alt={`${business.businessName} logo`}
                      width={120}
                      height={120}
                      className="w-24 h-24 sm:w-30 sm:h-30 rounded-2xl object-cover shadow-xl mx-auto mb-4"
                      onError={() => setLogoError(true)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`relative z-10 w-24 h-24 sm:w-30 sm:h-30 bg-gradient-to-r ${combinedStyles.primary} rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4`}
                  >
                    <span className="text-white font-bold text-4xl">{business.businessName.charAt(0)}</span>
                  </motion.div>
                )}
              </div>
              <motion.h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${combinedStyles.text} mb-4`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {business.businessName}
              </motion.h1>
            </motion.div>
            {/* Description */}
            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {business.businessDescription}
            </motion.p>

            {/* Business Hours Preview */}
            {business.enableBooking && Object.keys(business.businessHours).length > 0 && (
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FaClock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Open Today</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator overlays at the bottom */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-400 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-sm mb-2">Scroll to explore</div>
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-lg animate-pulse" />
            <FaChevronDown className="h-6 w-6 drop-shadow-lg relative z-10" />
          </div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      {business.featuresEnabled && business.features && business.features.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {business.features.filter(f => f.icon && f.title && f.description).map((feature, idx) => {
              const Icon = {
                FaTruck,
                FaHeadset,
                FaLock,
                FaAward,
                FaUndo,
                FaLeaf,
                FaCogs,
                FaUsers,
                FaStar,
                FaCalendarCheck,
              }[feature.icon] || FaStar;
              return (
                <motion.div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.04 }}
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-900 mb-4 shadow">
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* About/Overview Section */}
      {business.businessPlan && (
        <motion.section
          id="about"
          className={`py-20 px-4 ${styleTemplate.sectionBg}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={`${layoutStyle.className} max-w-4xl mx-auto`}>
            <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} text-center mb-12`}>
              {getTranslation("aboutBusiness", currentLanguage)}
            </h2>
            <motion.div
              className={`${isDark ? "bg-gray-700" : "bg-white"} p-8 ${styleTemplate.cardStyle}`}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className={`text-lg ${combinedStyles.text} leading-relaxed`}>
                {business.businessPlan}
              </p>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Products/Services Section */}
      <motion.section
        id="services"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={`${layoutStyle.className} max-w-6xl mx-auto`}>
          <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} text-center mb-8`}>
            {getTranslation("productsServices", currentLanguage)}
          </h2>
          {business.productDescription && (
            <motion.p
              className={`text-lg ${combinedStyles.text} leading-relaxed text-center mb-8 max-w-3xl mx-auto`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {business.productDescription}
            </motion.p>
          )}
          {business.products && business.products.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {business.products.map((product, idx) => (
                <motion.div
                  key={idx}
                  className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-8 shadow-xl flex flex-col items-center text-center`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {product.imageUrl && (
                    <div className="w-32 h-32 mb-4 flex items-center justify-center">
                      <Image
                        src={product.imageUrl}
                        alt={product.name || "Product image"}
                        width={120}
                        height={120}
                        className="rounded-xl object-cover w-32 h-32"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{product.name || "Product Name"}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{product.description || "Product description..."}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Business Hours Section - If enabled */}
      {business.enableBooking && Object.keys(business.businessHours).length > 0 && (
        <motion.section
          id="hours"
          className={`py-20 px-4 ${styleTemplate.sectionBg}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={`${layoutStyle.className} max-w-6xl mx-auto`}>
            <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} text-center mb-12`}>
              📅 {getTranslation("businessHours", currentLanguage)}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {Object.entries(business.businessHours).map(([day, hours]) => (
                hours && (
                  <div key={day} className={`${isDark ? "bg-gray-700" : "bg-white"} p-6 ${styleTemplate.cardStyle}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FaClock className={`w-5 h-5 ${combinedStyles.accent}`} />
                        <span className="font-medium capitalize">{day}</span>
                      </div>
                    </div>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>{hours}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Reviews Section - If enabled */}
      {business.enableReviews && reviews.length > 0 && (
        <motion.section
          id="reviews"
          className={`py-20 px-4 ${styleTemplate.sectionBg}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={`${layoutStyle.className} max-w-6xl mx-auto`}>
            <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} text-center mb-12`}>
              ⭐ {getTranslation("customerReviews", currentLanguage)}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 6).map((review, index) => (
                <motion.div
                  key={index}
                  className={`${isDark ? "bg-gray-700" : "bg-white"} p-6 ${styleTemplate.cardStyle}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>
                    {review.verified && (
                      <div className="flex items-center space-x-1 text-green-500">
                        <FaCheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className={`${combinedStyles.text} mb-4 text-lg leading-relaxed`}>"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {review.name}
                    </p>
                    {review.location && (
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {review.location}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Owner Section */}
      <motion.section
        id="owner"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={`${layoutStyle.className} max-w-4xl mx-auto text-center`}>
          <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} mb-12`}>
            {getTranslation("meetOwner", currentLanguage)}
          </h2>
          <motion.div
            className={`${isDark ? "bg-gray-700" : "bg-white"} p-8 inline-block ${styleTemplate.cardStyle}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {business.ownerPictureUrl ? (
              <motion.div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-6 overflow-hidden shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Image
                  src={business.ownerPictureUrl}
                  alt={business.fullName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                className={`w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r ${combinedStyles.secondary} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span className={`${combinedStyles.accent} font-bold text-4xl`}>
                  {business.fullName.split(" ").map(n => n.charAt(0)).join("")}
                </span>
              </motion.div>
            )}
            <h3 className={`text-2xl sm:text-3xl font-bold ${combinedStyles.text} mb-2`}>
              {business.fullName}
            </h3>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} mb-4`}>
              Founder & Owner
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section - If enabled */}
      {business.enableLeadCapture && (
        <motion.section
          id="newsletter"
          className={`py-20 px-4 bg-gradient-to-r ${combinedStyles.primary}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={`${layoutStyle.className} max-w-4xl mx-auto text-center`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              💼 {getTranslation("getSpecialOffers", currentLanguage)}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Subscribe to receive exclusive deals and updates from {business.businessName}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full sm:flex-1 px-4 py-3 border-0 focus:ring-2 focus:ring-white/50 ${styleTemplate.buttonStyle}`}
              />
              <button className={`w-full sm:w-auto bg-white text-gray-900 px-6 py-3 font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 ${styleTemplate.buttonStyle}`}>
                <FaEnvelope className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Social Media Section - If any social links exist */}
      {(business.socialLinks.facebook ||
        business.socialLinks.instagram ||
        business.socialLinks.twitter ||
        business.socialLinks.linkedin ||
        business.socialLinks.youtube) && (
        <motion.section
          className="py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={`${layoutStyle.className} max-w-4xl mx-auto text-center`}>
            <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} mb-12`}>
              {getTranslation("followUs", currentLanguage)}
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {business.socialLinks.facebook && (
                <motion.a
                  href={business.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFacebook className="w-6 h-6" />
                </motion.a>
              )}
              {business.socialLinks.instagram && (
                <motion.a
                  href={business.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagram className="w-6 h-6" />
                </motion.a>
              )}
              {business.socialLinks.twitter && (
                <motion.a
                  href={business.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTwitter className="w-6 h-6" />
                </motion.a>
              )}
              {business.socialLinks.linkedin && (
                <motion.a
                  href={business.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin className="w-6 h-6" />
                </motion.a>
              )}
              {business.socialLinks.youtube && (
                <motion.a
                  href={business.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaYoutube className="w-6 h-6" />
                </motion.a>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Contact Section */}
      <motion.section
        id="contact"
        className={`py-20 px-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-md mx-auto rounded-2xl shadow-xl p-8 bg-white dark:bg-gray-800 flex flex-col items-center gap-4">
          <h2 className={`text-3xl sm:text-4xl font-bold ${combinedStyles.text} text-center mb-4`}>
            {getTranslation("contactUs", currentLanguage)}
          </h2>
          {business.location && (
            <p className="mb-1 text-gray-500 flex items-center"><FaMapMarkerAlt className="mr-2" />{business.location}</p>
          )}
          {business.contactNumber && (
            <p className="mb-1 text-gray-500 flex items-center"><FaPhone className="mr-2" />{business.contactNumber}</p>
          )}
          <div className="mt-4 flex flex-col gap-2 w-full">
            {business.contactNumber && (
              <button onClick={handleWhatsAppClick} className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-200">
                <FaWhatsapp /> {getTranslation("whatsApp", currentLanguage)}
              </button>
            )}
            {business.contactNumber && (
              <button onClick={handleCallClick} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200">
                <FaPhone /> {getTranslation("call", currentLanguage)}
              </button>
            )}
          </div>
          {business.showMap && business.location && (
            <div className="rounded-2xl overflow-hidden shadow-xl h-64 w-full mt-4">
              <LeafletMap location={business.location} />
            </div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className={`py-12 px-4 ${isDark ? "bg-gray-900" : "bg-gray-900"} text-white`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className={`${layoutStyle.className} max-w-4xl mx-auto text-center`}>
          <div className="flex items-center justify-center space-x-4 mb-6">
            {business.logoUrl && (
              <Image
                src={business.logoUrl}
                alt={`${business.businessName} logo`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <span className="text-2xl font-bold">{business.businessName}</span>
          </div>
          
          <div className="space-y-2 mb-8">
            <p className="text-gray-400">{business.location}</p>
            <p className="text-gray-400">{business.contactNumber}</p>
          </div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} {business.businessName}. All rights reserved.
          </div>
        </div>
      </motion.footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
        {business.contactNumber && (
          <motion.button
            onClick={handleWhatsAppClick}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaWhatsapp className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Analytics Dashboard - If enabled and user has appropriate plan */}
      {showAnalytics && business.enableAnalytics && (ownerPlan === 'basic' || ownerPlan === 'premium') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${combinedStyles.text}`}>📊 Analytics Dashboard</h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <AnalyticsDashboard businessId={business.id} />
            </div>
          </motion.div>
        </div>
      )}

      {/* WhatsApp Widget */}
      {business.contactNumber && business.contactOption !== "none" && <WhatsAppWidget business={business} />}
    </div>
  )
}
