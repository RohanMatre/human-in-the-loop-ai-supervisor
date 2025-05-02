import React, { useState } from 'react';
import { KnowledgeEntry } from '../../../shared/types/index';

interface KnowledgeCardProps {
  entry: KnowledgeEntry;
  onEdit?: (id: string) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ entry, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse-slow"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Updated {formatDate(entry.updatedAt)}</span>
          </div>
          {onEdit && (
            <button 
              onClick={() => onEdit(entry.id)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Edit knowledge entry"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
        
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {entry.question}
        </h4>
        
        <div 
          className={`text-sm text-gray-600 dark:text-gray-300 transition-all duration-300 ${
            expanded ? 'max-h-96' : 'max-h-24 overflow-hidden'
          }`}
        >
          <p className={expanded ? '' : 'line-clamp-3'}>
            {entry.answer}
          </p>
        </div>
        
        {entry.answer.length > 150 && (
          <button 
            onClick={toggleExpanded}
            className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md flex items-center"
          >
            {expanded ? (
              <>
                <svg className="mr-1 h-4 w-4 transform rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Show less
              </>
            ) : (
              <>
                <svg className="mr-1 h-4 w-4 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Read more
              </>
            )}
          </button>
        )}
        
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeCard; 