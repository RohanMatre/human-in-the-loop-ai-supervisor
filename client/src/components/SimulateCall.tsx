import { useState } from 'react';
import { simulateApi } from '@services/api';
import Button from './Button';

const SimulateCall: React.FC = () => {
  const [query, setQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [conversationLog, setConversationLog] = useState<string[]>([]);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await simulateApi.simulateCall(query, customerName || undefined);
      
      setConversationLog(result.conversationLog);
      setRequestId(result.requestId);
      setQuery('');
    } catch (err) {
      setError('Failed to simulate call. Please try again.');
      console.error('Error simulating call:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Simulate AI Conversation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Test how the AI agent would handle a customer call</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Name (optional)
            </label>
            <input
              type="text"
              id="customerName"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Query
            </label>
            <div className="mt-1">
              <textarea
                id="query"
                rows={3}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter the customer's question or query"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              For example: "What are your salon hours?" or "I need to reschedule my appointment"
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={isLoading || !query.trim()}
              icon={
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              }
            >
              {isLoading ? 'Simulating...' : 'Simulate Call'}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 rounded-md p-4 animate-fade-in">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {conversationLog.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Conversation Log</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              {conversationLog.map((message, index) => {
                const isAI = message.startsWith('AI:');
                const isCustomer = message.startsWith('Customer:');
                
                return (
                  <div 
                    key={index} 
                    className={`mb-3 last:mb-0 p-2 rounded-lg animate-slide-in-left`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`, 
                      backgroundColor: isAI ? 'rgba(59, 130, 246, 0.05)' : isCustomer ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                      borderLeft: isAI ? '3px solid rgba(59, 130, 246, 0.5)' : isCustomer ? '3px solid rgba(16, 185, 129, 0.5)' : 'none'
                    }}
                  >
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{message}</p>
                  </div>
                );
              })}
            </div>
            {requestId && (
              <div className="mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800 animate-fade-in">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 dark:text-blue-300 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300">
                      Help request created with ID: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded text-xs">{requestId}</span>
                    </p>
                    <p className="mt-1 text-blue-700 dark:text-blue-300 opacity-80">
                      The request is now in the supervisor queue awaiting response.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulateCall; 