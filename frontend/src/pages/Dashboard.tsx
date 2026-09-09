import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickAction } from '../components/dashboard/QuickAction';
import { RecentMembers } from '../components/dashboard/RecentMembers';

interface DashboardStats {
  totalMembers: number;
  newMembers: number;
  activeMembers: number;
  visitors: number;
  recentRegistrations: Array<{
    id: number;
    name: string;
    joinedDate: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    newMembers: 0,
    activeMembers: 0,
    visitors: 0,
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch statistics from backend API
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5204/api/Dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Church Dashboard</h1>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={loading ? '...' : stats.totalMembers} icon="👥" />
        <StatCard title="New Members" value={loading ? '...' : stats.newMembers} icon="✨" />
        <StatCard title="Active Members" value={loading ? '...' : stats.activeMembers} icon="⚡" />
        <StatCard title="Visitors" value={loading ? '...' : stats.visitors} icon="🤝" />
      </div>

      {/* Main Grid: Quick Actions & Recent Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Render QuickAction with refresh callback */}
        <QuickAction onMemberAdded={fetchDashboardStats} />
        
        {/* Render Live Recent Members */}
        <RecentMembers members={stats.recentRegistrations} />
      </div>
    </div>
  );
};

export default Dashboard;