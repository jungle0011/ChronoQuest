'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaBan, FaUserCheck, FaUserTimes, FaSort } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AdminNav from '../components/AdminNav';

interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  plan: 'free' | 'basic' | 'premium';
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
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
    const safeStatus = status || 'active';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[safeStatus as keyof typeof styles]}`}>
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
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
                  placeholder="Search users by email or name..."
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
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Businesses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.name || user.displayName || 'No Name'}</div>
                            <div className="text-xs text-gray-400">
                              Joined {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPlanBadge(user.plan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.businessCount}</div>
                          <div className="text-xs text-gray-500">
                            {user.totalViews} views, {user.totalClicks} clicks
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatLastActivity(user.lastActivity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4" />
                            </Link>
                            
                            {user.status === 'active' ? (
                              <>
                                <button
                                  onClick={() => handleUserAction(user.id, 'suspend', 'Suspended by admin')}
                                  className="text-yellow-600 hover:text-yellow-900"
                                  title="Suspend User"
                                >
                                  <FaUserTimes className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'ban', 'Banned by admin')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Ban User"
                                >
                                  <FaBan className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, user.status === 'banned' ? 'unban' : 'activate')}
                                className="text-green-600 hover:text-green-900"
                                title={user.status === 'banned' ? 'Unban User' : 'Activate User'}
                              >
                                <FaUserCheck className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 