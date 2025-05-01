import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface HelpRequest {
  id: string;
  query: string;
  customerInfo: {
    id: string;
    name: string;
  };
  status: 'pending' | 'resolved';
  timestamp: string;
  response?: string;
  conversation?: {
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
}

const RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Simulate loading the request from the server
    const timer = setTimeout(() => {
      // This would be an API call in a real application
      const mockRequest: HelpRequest = {
        id: requestId || '0',
        query: requestId === '1' 
          ? 'How do I reset my password?' 
          : 'When will my order arrive?',
        customerInfo: {
          id: requestId === '1' ? '1001' : '1042',
          name: requestId === '1' ? 'John Doe' : 'Jane Smith'
        },
        status: requestId === '1' ? 'resolved' : 'pending',
        timestamp: new Date(
          requestId === '1' 
            ? Date.now() - 3 * 60 * 60 * 1000 
            : Date.now() - 15 * 60 * 1000
        ).toISOString(),
        response: requestId === '1' 
          ? 'You can reset your password by clicking on the "Forgot Password" link on the login page.' 
          : undefined,
        conversation: [
          {
            role: 'user',
            content: requestId === '1' 
              ? 'Hello, I forgot my password. How can I reset it?' 
              : 'Hi, I ordered something last week. When will it arrive?',
            timestamp: new Date(
              requestId === '1' 
                ? Date.now() - 3 * 60 * 60 * 1000 - 2 * 60 * 1000
                : Date.now() - 15 * 60 * 1000 - 2 * 60 * 1000
            ).toISOString()
          },
          {
            role: 'assistant',
            content: requestId === '1'
              ? 'Let me check with my supervisor about the password reset process...'
              : 'Let me check with my supervisor about your order status...',
            timestamp: new Date(
              requestId === '1'
                ? Date.now() - 3 * 60 * 60 * 1000 - 1 * 60 * 1000
                : Date.now() - 15 * 60 * 1000 - 1 * 60 * 1000
            ).toISOString()
          },
          ...(requestId === '1' ? [
            {
              role: 'assistant',
              content: 'You can reset your password by clicking on the "Forgot Password" link on the login page.',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            }
          ] : [])
        ]
      };
      
      setRequest(mockRequest);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [requestId]);

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!request || !response.trim()) return;
    
    // In a real application, this would make an API call to update the request
    setRequest({
      ...request,
      status: 'resolved',
      response,
      conversation: [
        ...(request.conversation || []),
        {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        }
      ]
    });
    
    setResponse('');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-500">Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">Request not found.</p>
        <button
          className="mt-4 btn btn-primary"
          onClick={() => navigate('/supervisor')}
        >
          Back to Supervisor Panel
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
          <p className="mt-1 text-gray-500">ID: {request.id}</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/supervisor')}
        >
          Back to All Requests
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Query</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {new Date(request.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Query</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.query}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.customerInfo.id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.customerInfo.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Conversation</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {request.conversation?.map((message, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`inline-block rounded-lg px-4 py-2 max-w-xl ${
                    message.role === 'user'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
                <div className={`mt-1 text-xs text-gray-500 ${message.role === 'user' ? 'text-left' : 'text-right'}`}>
                  {message.role === 'user' ? 'Customer' : 'AI Assistant'} • {new Date(message.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Provide Response</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your response will be sent to the AI agent and stored in the knowledge base.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handleSubmitResponse}>
              <div>
                <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                  Response
                </label>
                <textarea
                  id="response"
                  name="response"
                  rows={4}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md"
                  placeholder="Enter your response here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails; 