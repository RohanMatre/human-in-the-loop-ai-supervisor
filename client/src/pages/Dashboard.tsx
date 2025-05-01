import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '@services/api';
import { Stats } from '../../../shared/types';
import SimulateCall from '@components/SimulateCall';

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    pendingRequests: 0,
    resolvedRequests: 0,
    responseRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to sample data
        setStats({
          totalRequests: 125,
          pendingRequests: 12,
          resolvedRequests: 113,
          responseRate: 90.4
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Overview of AI Supervisor system performance</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalRequests}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingRequests}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Resolved Requests</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.resolvedRequests}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.responseRate.toFixed(1)}%</dd>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Latest Requests</h2>
            <Link to="/supervisor" className="text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {/* Simulate recent requests */}
              <li>
                <Link to="/requests/1" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">How do I reset my password?</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Resolved
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Customer ID: 1001
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        3 hours ago
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/requests/2" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">When will my order arrive?</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Customer ID: 1042
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        15 minutes ago
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <SimulateCall />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 