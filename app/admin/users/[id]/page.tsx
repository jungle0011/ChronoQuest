'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaBan, FaUserCheck, FaUserTimes, FaEye, FaEdit, FaTrash, FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import AdminNav from '../../components/AdminNav';

interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'banned' | 'suspended';
  createdAt: string;
  bannedAt?: string;
  banReason?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  businessCount: number;
  totalViews: number;
  totalClicks: number;
  lastActivity: number;
  businesses: any[];
  statistics: {
    totalBusinesses: number;
    totalViews: number;
    totalClicks: number;
    totalLeads: number;
    averageViewsPerBusiness: number;
    averageClicksPerBusiness: number;
  };
  planUpdatedAt?: string;
  billingCycle?: string;
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'premium'>('free');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [params.id]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      toast.error('Failed to fetch user details');
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: string, reason?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      toast.success(`User ${action}ed successfully`);
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePlanChange = async () => {
    setActionLoading(true);
    try {
      const updates: any = { plan: selectedPlan };
      if (selectedPlan !== 'free') {
        updates.billingCycle = selectedBillingCycle;
        updates.planUpdatedAt = new Date().toISOString();
      }
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (!response.ok) throw new Error('Failed to update user plan');
      toast.success(`User plan set to ${selectedPlan}`);
      fetchUserDetails();
    } catch (error) {
      toast.error('Failed to update user plan');
      console.error('Error updating user plan:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Add handler to set plan as expired
  const handleSetPlanExpired = async () => {
    setActionLoading(true);
    try {
      const expiredDate = new Date();
      expiredDate.setMonth(expiredDate.getMonth() - 2); // 2 months ago
      const updates: any = {};
      if (user?.plan && user.plan !== 'free') {
        updates.planUpdatedAt = expiredDate.toISOString();
      }
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (!response.ok) throw new Error('Failed to set plan as expired');
      toast.success('Plan set as expired for testing.');
      fetchUserDetails();
    } catch (error) {
      toast.error('Failed to set plan as expired');
      console.error('Error setting plan as expired:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
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
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[plan as keyof typeof styles]}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  // Helper to calculate expiration/renewal date
  const getExpirationDate = () => {
    if (!user?.planUpdatedAt || !user?.billingCycle) return null;
    const date = new Date(user.planUpdatedAt);
    if (user.billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (user.billingCycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading user details...</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/users" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Back to Users</span>
            </Link>
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>
          
          <div className="flex space-x-2">
            {user.status === 'active' ? (
              <>
                <button
                  onClick={() => handleUserAction('suspend', 'Suspended by admin')}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                  <FaUserTimes />
                  <span>Suspend</span>
                </button>
                <button
                  onClick={() => handleUserAction('ban', 'Banned by admin')}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  <FaBan />
                  <span>Ban</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleUserAction(user.status === 'banned' ? 'unban' : 'activate')}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                <FaUserCheck />
                <span>{user.status === 'banned' ? 'Unban' : 'Activate'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-bold mb-1">{user.name || user.displayName || user.email}</div>
                  <div className="text-gray-600 text-sm mb-1">{user.email}</div>
                  <div className="flex items-center gap-2 mb-1">
                    {getPlanBadge(user.plan)}
                    {user.billingCycle && user.plan !== 'free' && (
                      <span className="text-xs text-blue-600 font-semibold">({user.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})</span>
                    )}
                  </div>
                  {user.plan !== 'free' && user.planUpdatedAt && user.billingCycle && (
                    <div className="text-xs text-green-700 font-semibold">
                      Next renewal: {getExpirationDate() || 'N/A'}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">Joined {formatDate(user.createdAt)}</div>
                </div>
                
                {/* Plan/BillingCycle Controls */}
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-medium">Set Plan</label>
                  <select
                    value={selectedPlan}
                    onChange={e => setSelectedPlan(e.target.value as 'free' | 'basic' | 'premium')}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={actionLoading}
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                  {selectedPlan !== 'free' && (
                    <>
                      <label className="text-sm font-medium mt-2">Billing Cycle</label>
                      <select
                        value={selectedBillingCycle || 'monthly'}
                        onChange={e => setSelectedBillingCycle(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        disabled={actionLoading}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </>
                  )}
                  <button
                    onClick={handlePlanChange}
                    disabled={actionLoading}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving...' : 'Update Plan'}
                  </button>
                  {user && user.plan !== 'free' && (
                    <button
                      onClick={handleSetPlanExpired}
                      disabled={actionLoading}
                      className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 text-xs"
                      title="Set planUpdatedAt to a date in the past for expiration testing"
                    >
                      Set Plan as Expired (Test)
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(user.status)}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Activity</label>
                <p className="text-lg">{formatLastActivity(user.lastActivity)}</p>
              </div>
              
              {user.status === 'banned' && user.banReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Ban Reason</label>
                  <p className="text-lg text-red-600">{user.banReason}</p>
                  <p className="text-sm text-gray-500">Banned on {formatDate(user.bannedAt!)}</p>
                </div>
              )}
              
              {user.status === 'suspended' && user.suspensionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Suspension Reason</label>
                  <p className="text-lg text-yellow-600">{user.suspensionReason}</p>
                  <p className="text-sm text-gray-500">Suspended on {formatDate(user.suspendedAt!)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.statistics.totalBusinesses}</div>
                  <div className="text-sm text-gray-500">Total Businesses</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.statistics.totalViews}</div>
                  <div className="text-sm text-gray-500">Total Views</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.statistics.totalClicks}</div>
                  <div className="text-sm text-gray-500">Total Clicks</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{user.statistics.totalLeads}</div>
                  <div className="text-sm text-gray-500">Total Leads</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{user.statistics.averageViewsPerBusiness}</div>
                  <div className="text-sm text-gray-500">Avg Views/Business</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold">{user.statistics.averageClicksPerBusiness}</div>
                  <div className="text-sm text-gray-500">Avg Clicks/Business</div>
                </div>
              </div>
            </div>

            {/* Businesses */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Businesses ({user.businesses.length})</h2>
              </div>
              
              {user.businesses.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No businesses found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {user.businesses.map((business) => (
                    <div key={business.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{business.businessName}</h3>
                          <p className="text-sm text-gray-500">{business.businessDescription}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {formatDate(business.createdAt)}</span>
                            {business.analytics && (
                              <>
                                <span>Views: {business.analytics.views || 0}</span>
                                <span>Clicks: {business.analytics.clicks || 0}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/sites/${business.id}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                            title="View Site"
                          >
                            <FaEye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/business/${business.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Business"
                          >
                            <FaEdit className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 