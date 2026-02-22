import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import KPICard from '../../components/KPICard.jsx';
import RevenueChart from '../../components/RevenueChart.jsx';
import TopPartnersTable from '../../components/TopPartnersTable.jsx';
import LazyComponent from '../../components/LazyComponent.jsx';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/admin/analytics/stats');
      
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Admin dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#6b7280' }}>
              Loading analytics data...
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="p-6 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div
          className="p-8 rounded-xl text-center max-w-md"
          style={{
            background: 'rgba(239,68,68,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239,68,68,0.2)'
          }}
        >
          <div className="text-red-500 text-4xl mb-4">🚨</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1f2937' }}>
            Dashboard Error
          </h2>
          <p className="mb-4" style={{ color: '#6b7280' }}>{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: '#ef4444',
              color: 'white'
            }}
            onMouseOver={(e) => e.target.style.background = '#dc2626'}
            onMouseOut={(e) => e.target.style.background = '#ef4444'}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f2937' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: '#6b7280' }}>
                Welcome back, {user?.name || 'Admin'}! Here's your platform analytics.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#1f2937'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <LazyComponent 
            component="KPICard"
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            trend={5.2}
            loading={loading}
          />
          <LazyComponent 
            component="KPICard"
            title="Total Partners"
            value={stats?.totalPartners || 0}
            icon="👤"
            trend={3.8}
            loading={loading}
          />
          <LazyComponent 
            component="KPICard"
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon="📅"
            trend={-2.1}
            loading={loading}
          />
          <LazyComponent 
            component="KPICard"
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            icon="💰"
            trend={8.7}
            loading={loading}
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <LazyComponent 
              component="RevenueChart"
              data={stats?.monthlyRevenue || []}
              loading={loading}
            />
          </div>

          {/* Additional Stats */}
          <div className="space-y-6">
            <LazyComponent 
              component="KPICard"
              title="Quick Stats"
              value={stats?.activeBookings || 0}
              icon="📊"
              loading={loading}
              fallback={
                <div className="p-6 rounded-xl">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Top Partners Table */}
        <div className="mt-8">
          <LazyComponent 
            component="TopPartnersTable"
            data={stats?.topPartners || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
