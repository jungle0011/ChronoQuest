'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AdminNav from '../components/AdminNav';
import type { SavedBusiness } from '@/lib/types';
import BusinessTable from '../components/BusinessTable';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<SavedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      
      const data = await response.json();
      setBusinesses(data);
    } catch (error) {
      toast.error('Failed to fetch businesses');
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    
    try {
      const response = await fetch(`/api/business/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete business');
      
      toast.success('Business deleted successfully');
      setBusinesses(businesses.filter(b => b.id !== id));
    } catch (error) {
      toast.error('Failed to delete business');
      console.error('Error deleting business:', error);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = search === '' || 
      business.businessName.toLowerCase().includes(search.toLowerCase()) ||
      business.fullName.toLowerCase().includes(search.toLowerCase()) ||
      business.businessDescription.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'premium' && business.interestedInPremium) ||
      (statusFilter === 'basic' && !business.interestedInPremium);
    
    const matchesPlan = planFilter === '' || 
      business.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isPremium: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        isPremium 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isPremium ? 'Premium' : 'Basic'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="container mx-auto px-4 py-8 text-center">Loading businesses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Business Management</h1>
          <Link 
            href="/admin" 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search businesses by name, owner, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Plans</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          )}
        </div>

        <BusinessTable />

        {filteredBusinesses.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No businesses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
} 