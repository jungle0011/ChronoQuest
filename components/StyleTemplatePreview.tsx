"use client"

import { motion } from "framer-motion"

interface StyleTemplatePreviewProps {
  style: string
  name: string
  description: string
  isSelected: boolean
  onClick: () => void
}

export default function StyleTemplatePreview({
  style,
  name,
  description,
  isSelected,
  onClick,
}: StyleTemplatePreviewProps) {
  const getPreviewElements = (style: string) => {
    const baseClasses = "w-full h-24 rounded-lg mb-3 relative overflow-hidden flex flex-col justify-between p-2"

    switch (style) {
      case "modern":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="h-2 w-1/3 rounded bg-slate-300"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-blue-200"></div>
            <div className="h-2 w-1/2 rounded bg-blue-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="h-2 w-8 rounded bg-blue-300"></div>
            </div>
          </div>
        )
      case "luxury":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-500 to-amber-400"></div>
              <div className="h-2 w-1/3 rounded bg-yellow-300"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-yellow-200"></div>
            <div className="h-2 w-1/2 rounded bg-amber-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-yellow-500 to-amber-400"></div>
              <div className="h-2 w-8 rounded bg-yellow-300"></div>
            </div>
          </div>
        )
      case "bold":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-orange-50 to-red-50 border border-orange-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-600 to-red-600"></div>
              <div className="h-2 w-1/3 rounded bg-orange-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-orange-200"></div>
            <div className="h-2 w-1/2 rounded bg-red-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-orange-600 to-red-600"></div>
              <div className="h-2 w-8 rounded bg-orange-300"></div>
            </div>
          </div>
        )
      case "classic":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-stone-50 to-gray-100 border border-stone-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-stone-800 to-gray-900"></div>
              <div className="h-2 w-1/3 rounded bg-stone-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-stone-200"></div>
            <div className="h-2 w-1/2 rounded bg-gray-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-stone-800 to-gray-900"></div>
              <div className="h-2 w-8 rounded bg-stone-300"></div>
            </div>
          </div>
        )
      case "playful":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-pink-50 to-purple-100 border border-pink-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-pink-400 to-purple-400"></div>
              <div className="h-2 w-1/3 rounded bg-pink-300"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-pink-200"></div>
            <div className="h-2 w-1/2 rounded bg-purple-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-pink-400 to-purple-400"></div>
              <div className="h-2 w-8 rounded bg-pink-300"></div>
            </div>
          </div>
        )
      case "professional":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-slate-700 to-blue-800"></div>
              <div className="h-2 w-1/3 rounded bg-blue-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-blue-200"></div>
            <div className="h-2 w-1/2 rounded bg-slate-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-slate-700 to-blue-800"></div>
              <div className="h-2 w-8 rounded bg-blue-300"></div>
            </div>
          </div>
        )
      case "tech":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-teal-500"></div>
              <div className="h-2 w-1/3 rounded bg-cyan-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-cyan-200"></div>
            <div className="h-2 w-1/2 rounded bg-teal-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-cyan-500 to-teal-500"></div>
              <div className="h-2 w-8 rounded bg-cyan-300"></div>
            </div>
          </div>
        )
      case "artistic":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-300`}>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="h-2 w-1/3 rounded bg-indigo-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-indigo-200"></div>
            <div className="h-2 w-1/2 rounded bg-purple-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="h-2 w-8 rounded bg-indigo-300"></div>
            </div>
          </div>
        )
      case "elegant":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-stone-100 border border-stone-300`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-stone-800 to-gray-900"></div>
              <div className="h-2 w-1/3 rounded bg-stone-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-stone-200"></div>
            <div className="h-2 w-1/2 rounded bg-gray-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-stone-800 to-gray-900"></div>
              <div className="h-2 w-8 rounded bg-stone-300"></div>
            </div>
          </div>
        )
      case "minimal":
        return (
          <div className={`${baseClasses} bg-white border border-gray-200`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gray-900"></div>
              <div className="h-2 w-1/3 rounded bg-gray-300"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-gray-200"></div>
            <div className="h-2 w-1/2 rounded bg-gray-100"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gray-900"></div>
              <div className="h-2 w-8 rounded bg-gray-300"></div>
            </div>
          </div>
        )
      case "creative":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-300`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <div className="h-2 w-1/3 rounded bg-purple-300"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-pink-200"></div>
            <div className="h-2 w-1/2 rounded bg-purple-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <div className="h-2 w-8 rounded bg-pink-300"></div>
            </div>
          </div>
        )
      case "corporate":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-300`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-slate-700 to-blue-800"></div>
              <div className="h-2 w-1/3 rounded bg-blue-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-blue-200"></div>
            <div className="h-2 w-1/2 rounded bg-slate-400"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-slate-700 to-blue-800"></div>
              <div className="h-2 w-8 rounded bg-blue-300"></div>
            </div>
          </div>
        )
      case "neon":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-300`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-teal-500 animate-pulse"></div>
              <div className="h-2 w-1/3 rounded bg-cyan-300 animate-pulse"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-cyan-200"></div>
            <div className="h-2 w-1/2 rounded bg-teal-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-cyan-500 to-teal-500 animate-pulse"></div>
              <div className="h-2 w-8 rounded bg-cyan-300 animate-pulse"></div>
            </div>
          </div>
        )
      case "vintage":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-700 to-orange-700"></div>
              <div className="h-2 w-1/3 rounded bg-amber-400"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-orange-200"></div>
            <div className="h-2 w-1/2 rounded bg-amber-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-amber-700 to-orange-700"></div>
              <div className="h-2 w-8 rounded bg-orange-300"></div>
            </div>
          </div>
        )
      case "glass":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 backdrop-blur-sm`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70"></div>
              <div className="h-2 w-1/3 rounded bg-indigo-200 opacity-70"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-purple-100 opacity-70"></div>
            <div className="h-2 w-1/2 rounded bg-indigo-100 opacity-70"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70"></div>
              <div className="h-2 w-8 rounded bg-purple-200 opacity-70"></div>
            </div>
          </div>
        )
      case "nature":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300`}> 
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="h-2 w-1/3 rounded bg-green-300"></div>
            </div>
            <div className="h-2 w-2/3 rounded bg-green-200"></div>
            <div className="h-2 w-1/2 rounded bg-emerald-200"></div>
            <div className="flex justify-between items-end">
              <div className="h-3 w-12 rounded bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="h-2 w-8 rounded bg-green-300"></div>
            </div>
          </div>
        )
      default:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200`}></div>
        )
    }
  }

  return (
    <motion.div
      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? "border-blue-500 bg-blue-50 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {getPreviewElements(style)}

      <div className="text-center">
        <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}
