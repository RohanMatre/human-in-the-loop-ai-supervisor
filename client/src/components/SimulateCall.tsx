import { useState } from 'react';
import { simulateApi } from '@services/api';

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
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Simulate AI Conversation</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="customerName" className="form-label">Customer Name (optional)</label>
          <input
            type="text"
            id="customerName"
            className="form-input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="query" className="form-label">Customer Query</label>
          <textarea
            id="query"
            rows={3}
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter the customer's question or query"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? 'Simulating...' : 'Simulate Call'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      )}

      {conversationLog.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Conversation Log</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            {conversationLog.map((message, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <p className="whitespace-pre-wrap">{message}</p>
              </div>
            ))}
          </div>
          {requestId && (
            <div className="mt-4 text-sm">
              <p>
                Help request created with ID: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{requestId}</span>
              </p>
              <p className="mt-1 text-gray-500">
                The request is now in the supervisor queue for response.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulateCall; 