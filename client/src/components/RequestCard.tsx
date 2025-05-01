import React from 'react';
import { Link } from 'react-router-dom';
import { HelpRequest } from '../../../shared/types/index';

interface RequestCardProps {
  request: HelpRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[request.status as keyof typeof statusStyles]}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            <span className="ml-3 text-xs text-gray-500">{formatTimeDifference(request.timestamp)}</span>
          </div>
          <span className="text-xs text-gray-500">ID: {request.id.slice(0, 8)}</span>
        </div>
        
        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {request.query}
        </h4>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {request.context || 'No additional context provided.'}
        </p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/requests/${request.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View details
          </Link>
          
          {request.status === 'pending' && (
            <Link 
              to={`/supervisor?requestId=${request.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Respond
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard; 