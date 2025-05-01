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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-500">Updated {formatDate(entry.updatedAt)}</span>
          </div>
          {onEdit && (
            <button 
              onClick={() => onEdit(entry.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
        
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {entry.question}
        </h4>
        
        <div className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-3'}`}>
          {entry.answer}
        </div>
        
        {entry.answer.length > 150 && (
          <button 
            onClick={toggleExpanded}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeCard; 