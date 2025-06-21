"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGlobe, FaChevronDown } from "react-icons/fa"
import { languages, getCurrentLanguage } from "@/lib/translations"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
  className?: string
}

export default function LanguageSelector({ currentLanguage, onLanguageChange, className = "" }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const current = getCurrentLanguage(currentLanguage)

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white text-gray-700 font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-300 shadow-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaGlobe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{current.nativeName}</span>
        <span className="text-lg sm:hidden">{current.flag}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50 text-gray-700"
          >
            {Object.values(languages).map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200 ${
                  currentLanguage === lang.code ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
                {currentLanguage === lang.code && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
