"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaMobile, FaTabletAlt, FaDesktop } from "react-icons/fa"
import LivePreview from "./LivePreview"
import type { BusinessFormData } from "@/lib/types"

interface ResponsivePreviewProps {
  formData: BusinessFormData
}

type ViewportType = "mobile" | "tablet" | "desktop"

export default function ResponsivePreview({ formData }: ResponsivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportType>("desktop")

  const viewportConfig = {
    mobile: {
      width: "375px",
      height: "667px",
      icon: <FaMobile className="w-4 h-4" />,
      label: "Mobile",
    },
    tablet: {
      width: "768px",
      height: "1024px",
      icon: <FaTabletAlt className="w-4 h-4" />,
      label: "Tablet",
    },
    desktop: {
      width: "100%",
      height: "100%",
      icon: <FaDesktop className="w-4 h-4" />,
      label: "Desktop",
    },
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header with Viewport Toggle */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">🔥 Live Preview</h3>
          <p className="text-sm text-purple-100">See your changes in real-time</p>
        </div>

        <div className="flex items-center space-x-1 bg-white/20 rounded-lg p-1">
          {(Object.keys(viewportConfig) as ViewportType[]).map((view) => (
            <button
              key={view}
              onClick={() => setViewport(view)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewport === view
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {viewportConfig[view].icon}
              <span className="hidden sm:inline">{viewportConfig[view].label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Preview Content with Responsive Container */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <motion.div
          key={viewport}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full flex items-center justify-center"
        >
          <div
            className={`bg-white rounded-lg shadow-2xl overflow-hidden ${
              viewport === "desktop" ? "w-full h-full" : ""
            }`}
            style={{
              width: viewport !== "desktop" ? viewportConfig[viewport].width : "100%",
              height: viewport !== "desktop" ? viewportConfig[viewport].height : "100%",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <div className="h-full overflow-y-auto">
              <LivePreview formData={formData} viewport={viewport} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
