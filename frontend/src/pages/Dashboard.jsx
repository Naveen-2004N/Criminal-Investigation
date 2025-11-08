import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Eye, ShieldAlert, UserCheck } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import CriminalCard from '../components/CriminalCard.jsx';
import { getCriminals } from '../services/criminalService.js';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const [criminals, setCriminals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth(); // Get user info from context

  useEffect(() => {
    // Only fetch data if the user is logged in
    if (userInfo) {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const data = await getCriminals(); 
          setCriminals(data);
          setStats({
            total: data.length, // This will be the count of recent criminals
            highRisk: data.filter(c => c.riskLevel === 'High').length,
          });
          setError('');
        } catch (err) {
          setError('Failed to fetch dashboard data. You may be logged out.');
          console.error("Failed to fetch criminals", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    } else {
      // If there's no user, stop loading and don't show an error.
      setLoading(false);
    }
  }, [userInfo]); // Re-run effect when userInfo changes

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {error && <div className="text-center py-4 text-red-500 bg-red-100 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Recent Criminals" 
          value={stats.total} 
          icon={<Users size={20} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Detections (Simulated)" 
          value="42" 
          change={12} 
          icon={<Eye size={20} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard 
          title="High Risk (Recent)" 
          value={stats.highRisk} 
          icon={<AlertTriangle size={20} className="text-white" />}
          color="bg-orange-500"
        />
        <StatCard 
          title="Active Surveillance" 
          value="8" 
          icon={<ShieldAlert size={20} className="text-white" />}
          color="bg-purple-500"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          <UserCheck className="inline-block mr-2 text-blue-500" size={20} />
          Recently Registered Criminals
        </h2>
        {criminals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {criminals.slice(0, 8).map(criminal => (
              <CriminalCard key={criminal._id} criminal={criminal} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            {userInfo ? 'No recent criminals found.' : 'Please log in to view data.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
