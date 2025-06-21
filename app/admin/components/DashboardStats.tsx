"use client";

import { useEffect, useState } from 'react';
import { FaBuilding, FaUsers, FaUpload, FaChartLine, FaEye, FaMousePointer, FaUserPlus, FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

type Stats = {
  totalBusinesses: number;
  totalUsers: number;
  totalUploads: number;
  premiumBusinesses: number;
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  totalWhatsappClicks: number;
  totalPhoneClicks: number;
  totalMapClicks: number;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    totalUsers: 0,
    totalUploads: 0,
    premiumBusinesses: 0,
    totalViews: 0,
    totalClicks: 0,
    totalLeads: 0,
    totalWhatsappClicks: 0,
    totalPhoneClicks: 0,
    totalMapClicks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const businessCards = [
    {
      title: 'Total Businesses',
      value: stats.totalBusinesses,
      icon: <FaBuilding className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Premium Businesses',
      value: stats.premiumBusinesses,
      icon: <FaChartLine className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Uploads',
      value: stats.totalUploads,
      icon: <FaUpload className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  const analyticsCards = [
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: <FaEye className="w-6 h-6" />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks,
      icon: <FaMousePointer className="w-6 h-6" />,
      color: 'bg-pink-500',
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: <FaUserPlus className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'WhatsApp Clicks',
      value: stats.totalWhatsappClicks,
      icon: <FaWhatsapp className="w-6 h-6" />,
      color: 'bg-green-600',
    },
    {
      title: 'Phone Clicks',
      value: stats.totalPhoneClicks,
      icon: <FaPhone className="w-6 h-6" />,
      color: 'bg-gray-700',
    },
    {
      title: 'Map Clicks',
      value: stats.totalMapClicks,
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      color: 'bg-red-500',
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-lg shadow-lg p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className="opacity-80">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-lg shadow-lg p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className="opacity-80">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 