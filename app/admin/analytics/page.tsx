'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminNav from '../components/AdminNav';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics?userId=admin');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8 text-center">Loading analytics...</div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8 text-center text-red-500">{error || 'No analytics data available'}</div>
      </div>
    );
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
  };

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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Platform Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Device Breakdown */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Device Breakdown</h2>
            <Doughnut
              data={{
                labels: ['Mobile', 'Desktop', 'Tablet'],
                datasets: [
                  {
                    data: [analytics.deviceStats.mobile, analytics.deviceStats.desktop, analytics.deviceStats.tablet],
                    backgroundColor: [
                      'rgb(54, 162, 235)',
                      'rgb(255, 99, 132)',
                      'rgb(255, 206, 86)'
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' as const } },
              }}
            />
          </div>
          {/* Location Stats */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Visitor Locations</h2>
            <Bar
              data={{
                labels: Object.keys(analytics.locationStats),
                datasets: [
                  {
                    label: 'Visitors',
                    data: Object.values(analytics.locationStats),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        {/* Top Pages Table */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-2">Top Pages</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topPages.map((page: any) => (
                <tr key={page.page}>
                  <td className="px-4 py-2 whitespace-nowrap">{page.page}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{page.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/admin" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
} 