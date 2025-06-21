'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaBan, FaUserCheck, FaUserTimes, FaSort } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  plan: 'free' | 'basic' | 'premium';
  billingCycle?: 'monthly' | 'yearly';
  planUpdatedAt?: string;
  status: 'active' | 'banned' | 'suspended';
  createdAt: string;
  businessCount: number;
  totalViews: number;
  totalClicks: number;
  lastActivity: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(planFilter && { plan: planFilter })
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, statusFilter, planFilter]);

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      toast.success(`User ${action}ed successfully`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error('Error updating user:', error);
    }
  };

  const handlePlanChange = async (userId: string, plan: 'free' | 'basic' | 'premium') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { plan } })
      });
      if (!response.ok) throw new Error('Failed to update user plan');
      toast.success(`User plan set to ${plan}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user plan');
      console.error('Error updating user plan:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastActivity = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      banned: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    const safePlan = plan || 'free';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[safePlan as keyof typeof styles]}`}>
        {safePlan.charAt(0).toUpperCase() + safePlan.slice(1)}
      </span>
    );
  };

  // Helper to calculate expiration/renewal date
  const getExpirationDate = (planUpdatedAt?: string, billingCycle?: 'monthly' | 'yearly') => {
    if (!planUpdatedAt || !billingCycle) return '';
    const date = new Date(planUpdatedAt);
    if (billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cycle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal/Expiration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Businesses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.name || user.displayName || 'No Name'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getPlanBadge(user.plan)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.plan !== 'free' && user.billingCycle ? (
                    <span className="text-xs font-semibold text-blue-700">{user.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.plan !== 'free' && user.planUpdatedAt && user.billingCycle ? (
                    <span className="text-xs font-semibold text-green-700">{getExpirationDate(user.planUpdatedAt, user.billingCycle)}</span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.businessCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatLastActivity(user.lastActivity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View All Users Link */}
      <div className="text-center">
        <Link
          href="/admin/users"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          View All Users
        </Link>
      </div>
    </div>
  );
} 