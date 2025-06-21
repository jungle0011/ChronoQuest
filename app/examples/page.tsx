"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft, FaEye, FaStar, FaMapMarkerAlt } from "react-icons/fa"
import { sampleBusinesses } from "@/lib/sample-data"

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
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

            <Link
              href="/create"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Your Site
            </Link>
          </div>
        </div>
      </header>

      {/* Examples Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🌟 Live Examples</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See real landing pages created with Bizplannaija. Each example showcases different styles, features, and
              industries to inspire your own business landing page.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Preview Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <div className="text-center z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <span className="text-white font-bold text-xl">{business.businessName.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{business.businessName}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}>
                        {business.siteStyle.charAt(0).toUpperCase() + business.siteStyle.slice(1)}
                      </span>
                      {business.interestedInPremium && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <FaStar className="w-3 h-3" />
                          <span>PRO</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-3 h-3" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{business.businessName}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{business.businessDescription}</p>

                  <div className="flex items-center space-x-2 text-gray-500 mb-4">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span className="text-sm">{business.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">by {business.fullName}</div>
                    <Link
                      href={`/sites/${business.id}`}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold"
                    >
                      <FaEye className="w-4 h-4" />
                      <span>View Live</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Own?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses who have already created their professional landing pages with Bizplannaija
              </p>
              <Link
                href="/create"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
              >
                🚀 Create Your Landing Page Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
