import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  change?: {
    value: string | number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  change
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    green: 'from-green-500 to-green-600 shadow-green-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    red: 'from-red-500 to-red-600 shadow-red-500/30',
    yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-500/30',
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-2xl font-semibold">{value}</h3>
            
            {change && (
              <div className="mt-2 flex items-center">
                {change.isPositive ? (
                  <svg className="w-3 h-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                <span className={`text-xs font-medium ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {change.value}
                </span>
              </div>
            )}
          </div>
          
          <div className={`rounded-lg p-2 bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard; 