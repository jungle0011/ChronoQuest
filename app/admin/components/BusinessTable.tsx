"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaEye } from 'react-icons/fa'
import type { SavedBusiness } from '@/lib/types'
import DeleteButton from '@/components/DeleteButton'

export default function BusinessTable() {
  const [businesses, setBusinesses] = useState<SavedBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses')
        if (!response.ok) {
          throw new Error('Failed to fetch businesses')
        }
        const data = await response.json()
        setBusinesses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  const handleDelete = (id: string) => {
    setBusinesses(businesses.filter(b => b.id !== id))
  }

  if (loading) {
    return <div>Loading businesses...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (businesses.length === 0) {
    return <div>No businesses found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Business
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {businesses.map((business) => (
            <tr key={business.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {business.logoUrl && (
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        src={business.logoUrl}
                        alt={business.businessName}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {business.businessName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {business.businessDescription}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{business.fullName}</div>
                <div className="text-sm text-gray-500">{business.contactNumber}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  business.interestedInPremium
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {business.interestedInPremium ? 'Premium' : 'Basic'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <Link
                    href={`/admin/business/${business.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEye className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/sites/${business.id}`}
                    className="text-green-600 hover:text-green-900 border border-green-600 rounded px-2 py-1 ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Live
                  </Link>
                  <DeleteButton id={business.id} onDelete={() => handleDelete(business.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 