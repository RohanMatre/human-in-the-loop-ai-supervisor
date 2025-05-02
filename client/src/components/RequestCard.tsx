import React from 'react';
import { Link } from 'react-router-dom';
import { HelpRequest } from '../../../shared/types/index';

interface RequestCardProps {
  request: HelpRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
    resolved: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
    rejected: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
  };

  // Calculate how long ago the request was made
  const formatTimeDifference = (timestamp: string) => {
    const requestTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[request.status as keyof typeof statusStyles]}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">{formatTimeDifference(request.timestamp)}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-tight">ID: {request.id.slice(0, 8)}</span>
        </div>
        
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {request.query}
        </h4>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
          {request.context || 'No additional context provided.'}
        </p>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
          <Link 
            to={`/requests/${request.id}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center"
          >
            View details
            <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          {request.status === 'pending' && (
            <Link 
              to={`/supervisor?requestId=${request.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 dark:border-blue-500 text-xs font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <svg className="mr-1.5 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Respond
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard; 