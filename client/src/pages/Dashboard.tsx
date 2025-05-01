import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi, requestsApi } from '@services/api';
import { HelpRequest, Stats } from '../../../shared/types';
import SimulateCall from '@components/SimulateCall';
import RequestCard from '@components/RequestCard';

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    pendingRequests: 0,
    resolvedRequests: 0,
    responseRate: 0
  });
  
  const [recentRequests, setRecentRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, requestsData] = await Promise.all([
          statsApi.getStats(),
          requestsApi.getAllRequests()
        ]);
        
        setStats(statsData);
        // Sort by timestamp (newest first) and take the first 5
        const sortedRequests = requestsData
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);
        setRecentRequests(sortedRequests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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

    fetchData();
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
            {recentRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentRequests.map(request => (
                  <li key={request.id}>
                    <Link to={`/requests/${request.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">{request.query}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'resolved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Customer ID: {request.customerInfo.id}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {new Date(request.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                No requests available
              </div>
            )}
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