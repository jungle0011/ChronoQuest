"use client";

import Link from "next/link"
import Image from "next/image"
import { FaEye, FaArrowLeft } from "react-icons/fa"
// import { getAllBusinesses } from "@/lib/storage" // REMOVE THIS
import DeleteButton from "@/components/DeleteButton"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import type { SavedBusiness } from "@/lib/types"
import DashboardStats from './components/DashboardStats'
import BusinessTable from './components/BusinessTable'
import RecentActivityTable from './components/RecentActivityTable'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import UserTable from './components/UserTable'
import AdminNav from './components/AdminNav'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyticsData {
  totalViews: number
  totalClicks: number
  totalLeads: number
  totalWhatsappClicks: number
  totalPhoneClicks: number
  totalMapClicks: number
  viewsByDay: Record<string, number>
  clicksByDay: Record<string, number>
}

export default function AdminPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<SavedBusiness[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [businessesData, analyticsResponse] = await Promise.all([
          fetch('/api/businesses').then(res => res.json()),
          fetch('/api/analytics').then(res => res.json())
        ])
        setBusinesses(businessesData)
        setAnalytics(analyticsResponse as AnalyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return <div className="p-8">Loading analytics...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  if (!analytics) {
    return <div className="p-8">No analytics data available</div>
  }

  const chartData = {
    labels: Object.keys(analytics.viewsByDay || {}).sort(),
    datasets: [
      {
        label: 'Views',
        data: Object.keys(analytics.viewsByDay || {})
          .sort()
          .map(date => (analytics.viewsByDay || {})[date]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Clicks',
        data: Object.keys(analytics.clicksByDay || {})
          .sort()
          .map(date => (analytics.clicksByDay || {})[date]),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Views and Clicks',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        <DashboardStats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Views</h2>
            <p className="text-3xl font-bold">{analytics.totalViews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Clicks</h2>
            <p className="text-3xl font-bold">{analytics.totalClicks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Leads</h2>
            <p className="text-3xl font-bold">{analytics.totalLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">WhatsApp Clicks</h2>
            <p className="text-3xl font-bold">{analytics.totalWhatsappClicks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Phone Clicks</h2>
            <p className="text-3xl font-bold">{analytics.totalPhoneClicks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Map Clicks</h2>
            <p className="text-3xl font-bold">{analytics.totalMapClicks}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={chartData} options={chartOptions} />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Business Management</h2>
            <Link 
              href="/admin/businesses" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage Businesses →
            </Link>
          </div>
          <BusinessTable />
        </div>

        <RecentActivityTable />
      </div>
    </div>
  )
}
