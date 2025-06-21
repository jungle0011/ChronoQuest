"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FaEye,
  FaMousePointer,
  FaEnvelope,
  FaWhatsapp,
  FaMobile,
  FaDesktop,
  FaTabletAlt,
  FaChartLine,
  FaCalendarAlt,
  FaGlobe,
} from "react-icons/fa"
import type { BusinessAnalytics } from "@/lib/types"

interface AnalyticsDashboardProps {
  businessId: string
  analytics?: BusinessAnalytics
  className?: string
}

export default function AnalyticsDashboard({ businessId, analytics, className = "" }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data - in production, this would come from your analytics service
  const mockAnalytics: BusinessAnalytics = {
    views: 1247,
    clicks: 89,
    leads: 23,
    whatsappClicks: 45,
    phoneClicks: 31,
    mapClicks: 13,
    lastVisit: new Date().toISOString(),
    dailyStats: {
      "2024-01-15": { views: 45, clicks: 3, leads: 1 },
      "2024-01-14": { views: 52, clicks: 4, leads: 2 },
      "2024-01-13": { views: 38, clicks: 2, leads: 0 },
      "2024-01-12": { views: 61, clicks: 5, leads: 3 },
      "2024-01-11": { views: 43, clicks: 3, leads: 1 },
      "2024-01-10": { views: 55, clicks: 4, leads: 2 },
      "2024-01-09": { views: 49, clicks: 3, leads: 1 },
    },
    topPages: [
      { page: "Landing Page", views: 856 },
      { page: "Contact Section", views: 234 },
      { page: "Services", views: 157 },
    ],
    deviceStats: {
      mobile: 68,
      desktop: 25,
      tablet: 7,
    },
    locationStats: {
      Nigeria: 78,
      Ghana: 12,
      Kenya: 6,
      "South Africa": 4,
    },
  }

  const data = analytics || mockAnalytics

  const stats = [
    {
      icon: <FaEye className="w-6 h-6" />,
      label: "Total Views",
      value: data.views.toLocaleString(),
      change: "+12.5%",
      color: "blue",
    },
    {
      icon: <FaMousePointer className="w-6 h-6" />,
      label: "Total Clicks",
      value: data.clicks.toLocaleString(),
      change: "+8.2%",
      color: "green",
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      label: "Leads Generated",
      value: data.leads.toLocaleString(),
      change: "+15.3%",
      color: "purple",
    },
    {
      icon: <FaWhatsapp className="w-6 h-6" />,
      label: "WhatsApp Clicks",
      value: data.whatsappClicks.toLocaleString(),
      change: "+22.1%",
      color: "green",
    },
  ]

  const deviceData = [
    { name: "Mobile", value: data.deviceStats.mobile, icon: <FaMobile className="w-5 h-5" />, color: "bg-blue-500" },
    {
      name: "Desktop",
      value: data.deviceStats.desktop,
      icon: <FaDesktop className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      name: "Tablet",
      value: data.deviceStats.tablet,
      icon: <FaTabletAlt className="w-5 h-5" />,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your landing page performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: "7d", label: "7 Days" },
            { key: "30d", label: "30 Days" },
            { key: "90d", label: "90 Days" },
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeRange === range.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>{stat.icon}</div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Views</h3>
            <FaChartLine className="w-5 h-5 text-blue-600" />
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {Object.entries(data.dailyStats)
              .slice(-7)
              .map(([date, stats], index) => {
                const maxViews = Math.max(...Object.values(data.dailyStats).map((s) => s.views))
                const width = (stats.views / maxViews) * 100

                return (
                  <div key={date} className="flex items-center space-x-3">
                    <div className="w-16 text-xs text-gray-600 flex-shrink-0">
                      {new Date(date).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                        {stats.views}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
            <FaMobile className="w-5 h-5 text-green-600" />
          </div>

          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${device.color} text-white`}>{device.icon}</div>
                  <span className="font-medium text-gray-900">{device.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-100 rounded-full h-2">
                    <motion.div
                      className={`h-full ${device.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${device.value}%` }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8">{device.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Sections</h3>
            <FaEye className="w-5 h-5 text-purple-600" />
          </div>

          <div className="space-y-4">
            {data.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{page.page}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(page.views / data.topPages[0].views) * 100}%` }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12">{page.views}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Location Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
            <FaGlobe className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-4">
            {Object.entries(data.locationStats).map(([country, percentage], index) => (
              <div key={country} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{country}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        <FaCalendarAlt className="w-4 h-4 inline mr-2" />
        Last updated: {new Date(data.lastVisit).toLocaleString()}
      </div>
    </div>
  )
}
