"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp, FaTimes, FaClock, FaCheckCircle } from "react-icons/fa"
import type { SavedBusiness } from "@/lib/types"
import { getTranslation } from "@/lib/translations"

interface WhatsAppWidgetProps {
  business: SavedBusiness
  className?: string
}

export default function WhatsAppWidget({ business, className = "" }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Check if business is currently open
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date()
      const currentDay = now
        .toLocaleDateString("en-US", {
          weekday: "long", // Fixed: changed from "lowercase" to "long"
        })
        .toLowerCase() as keyof typeof business.businessHours
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTimeMinutes = currentHour * 60 + currentMinute

      const todayHours = business.businessHours[currentDay]
      if (!todayHours || todayHours.toLowerCase().includes("closed")) {
        setIsOnline(false)
        return
      }

      // Parse business hours (e.g., "9:00 AM - 5:00 PM")
      const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
      const match = todayHours.match(timeRegex)

      if (match) {
        const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match

        let startTimeMinutes = Number.parseInt(startHour) * 60 + Number.parseInt(startMin)
        let endTimeMinutes = Number.parseInt(endHour) * 60 + Number.parseInt(endMin)

        // Convert to 24-hour format
        if (startPeriod.toUpperCase() === "PM" && Number.parseInt(startHour) !== 12) {
          startTimeMinutes += 12 * 60
        }
        if (endPeriod.toUpperCase() === "PM" && Number.parseInt(endHour) !== 12) {
          endTimeMinutes += 12 * 60
        }
        if (startPeriod.toUpperCase() === "AM" && Number.parseInt(startHour) === 12) {
          startTimeMinutes -= 12 * 60
        }
        if (endPeriod.toUpperCase() === "AM" && Number.parseInt(endHour) === 12) {
          endTimeMinutes -= 12 * 60
        }

        setIsOnline(currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes)
      } else {
        // Default to online if can't parse hours
        setIsOnline(true)
      }
    }

    checkBusinessHours()
    const interval = setInterval(checkBusinessHours, 60000) // Check every minute
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [business.businessHours])

  const handleWhatsAppClick = () => {
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    const message = encodeURIComponent(
      business.whatsappSettings?.welcomeMessage ||
        `Hi! I'm interested in ${business.businessName}. Can you tell me more?`,
    )
    const whatsappUrl = `https://wa.me/${business.contactNumber.replace(/\D/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank")

    // Track analytics
    if (typeof window !== "undefined") {
      console.log("WhatsApp clicked")
    }
  }

  const handleToggle = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
    setIsOpen(!isOpen)
  }

  const position = business.whatsappSettings?.chatPosition || "bottom-right"
  const positionClasses = {
    "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
    "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-w-[calc(100vw-2rem)] sm:w-96"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{business.businessName}</h3>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-300" : "bg-red-300"}`}></div>
                      <span>{isOnline ? "Online" : "Offline"}</span>
                      {business.whatsappSettings?.businessHours && (
                        <>
                          <span>•</span>
                          <FaClock className="w-3 h-3" />
                          <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 -m-2 touch-manipulation"
                  style={{ minHeight: "44px", minWidth: "44px" }}
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <div className="bg-gray-100 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">
                    {business.whatsappSettings?.welcomeMessage ||
                      `Hi! Welcome to ${business.businessName}. How can we help you today?`}
                  </p>
                </div>

                {business.whatsappSettings?.autoReply && (
                  <div className="flex items-start space-x-2 text-xs text-gray-500">
                    <FaCheckCircle className="w-3 h-3 mt-0.5 text-green-500" />
                    <span>We typically reply instantly</span>
                  </div>
                )}
              </div>

              {/* Business Hours */}
              {business.whatsappSettings?.businessHours && Object.keys(business.businessHours).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {getTranslation("businessHours", business.language)}
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(business.businessHours)
                      .slice(0, 3)
                      .map(
                        ([day, hours]) =>
                          hours && (
                            <div key={day} className="flex justify-between text-xs text-gray-600">
                              <span className="capitalize">{day}</span>
                              <span>{hours}</span>
                            </div>
                          ),
                      )}
                    {Object.keys(business.businessHours).length > 3 && (
                      <div className="text-xs text-gray-500">+ more...</div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 active:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 touch-manipulation transform active:scale-95"
                style={{ minHeight: "48px" }}
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>{getTranslation("whatsappUs", business.language)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={handleToggle}
        className="bg-green-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl hover:bg-green-600 active:bg-green-700 transition-all duration-200 flex items-center justify-center relative touch-manipulation transform active:scale-95"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 0 } : { rotate: [0, -10, 10, -10, 0] }}
        transition={isOpen ? {} : { repeat: Number.POSITIVE_INFINITY, duration: 2, repeatDelay: 3 }}
        style={{ minHeight: "56px", minWidth: "56px" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaWhatsapp className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Online Status Indicator */}
        {business.whatsappSettings?.businessHours && (
          <div
            className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white ${
              isOnline ? "bg-green-400" : "bg-red-400"
            }`}
          />
        )}

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            1
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
