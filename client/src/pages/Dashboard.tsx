import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsApi, requestsApi } from '@services/api';
import { HelpRequest, Stats } from '../../../shared/types';
import SimulateCall from '@components/SimulateCall';
import RequestCard from '@components/RequestCard';
import Button from '@components/Button';

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
      <div className="flex items-center justify-center h-64">
        <div className="relative h-20 w-20">
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Overview of AI Supervisor system performance</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/supervisor">
              <Button 
                variant="primary" 
                size="md"
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Supervisor Panel
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Requests</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalRequests}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Requests</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.pendingRequests}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Resolved Requests</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.resolvedRequests}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Response Rate</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.responseRate.toFixed(1)}%</dd>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Latest Requests</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Most recent customer inquiries</p>
            </div>
            <Link to="/supervisor" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors">
              View all
              <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="overflow-hidden">
            {recentRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentRequests.map((request, index) => (
                  <li key={request.id} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link to={`/requests/${request.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">{request.query}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'resolved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              ID: {request.customerInfo.id}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {new Date(request.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 sm:p-6 text-center text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-4 text-lg font-medium">No requests available</p>
                <p className="mt-2">Customer requests will appear here when they come in</p>
              </div>
            )}
          </div>
        </div>

        <div className="animate-slide-in-right">
          <SimulateCall />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 