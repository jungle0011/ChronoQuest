"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  timestamp: string;
}

export default function RecentActivityTable() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/admin/activity?limit=100');
        const data = await response.json();
        setActivities(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recent activity');
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <div className="py-4">Loading recent activity...</div>;
  if (error) return <div className="py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Activity (Last 100)</h2>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activities.map((a) => (
            <tr key={a.id}>
              <td className="px-4 py-2 font-medium text-gray-900">{a.action}</td>
              <td className="px-4 py-2">{a.userId}</td>
              <td className="px-4 py-2">{a.entityType}{a.entityId ? ` (${a.entityId})` : ''}</td>
              <td className="px-4 py-2 text-xs text-gray-600">{JSON.stringify(a.details)}</td>
              <td className="px-4 py-2">{formatDate(a.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 