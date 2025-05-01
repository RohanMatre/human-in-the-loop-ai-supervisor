import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
}

const SupervisorPanel = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    // Simulate loading help requests from the server
    const timer = setTimeout(() => {
      const mockRequests: HelpRequest[] = [
        {
          id: '1',
          query: 'How do I reset my password?',
          customerInfo: {
            id: '1001',
            name: 'John Doe'
          },
          status: 'resolved',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          response: 'You can reset your password by clicking on the "Forgot Password" link on the login page.'
        },
        {
          id: '2',
          query: 'When will my order arrive?',
          customerInfo: {
            id: '1042',
            name: 'Jane Smith'
          },
          status: 'pending',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          query: 'How do I cancel my subscription?',
          customerInfo: {
            id: '1073',
            name: 'Bob Johnson'
          },
          status: 'pending',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        }
      ];
      
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredRequests = activeTab === 'pending'
    ? requests.filter(request => request.status === 'pending')
    : requests;

  const handleSubmitResponse = (requestId: string, response: string) => {
    // In a real application, this would make an API call to update the request
    setRequests(requests.map(request => 
      request.id === requestId
        ? { ...request, status: 'resolved' as const, response }
        : request
    ));
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-500">Loading requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Supervisor Panel</h1>
        <p className="mt-1 text-gray-500">Manage and respond to AI help requests</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Requests ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Requests ({requests.length})
            </button>
          </nav>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No {activeTab === 'pending' ? 'pending ' : ''}requests found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request.id} className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link to={`/requests/${request.id}`} className="hover:underline">
                        {request.query}
                      </Link>
                    </h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">
                        Customer: {request.customerInfo.name} ({request.customerInfo.id})
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(request.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>

                {request.status === 'pending' ? (
                  <div className="mt-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const responseInput = form.elements.namedItem('response') as HTMLTextAreaElement;
                        handleSubmitResponse(request.id, responseInput.value);
                        form.reset();
                      }}
                    >
                      <div>
                        <label htmlFor={`response-${request.id}`} className="block text-sm font-medium text-gray-700">
                          Response
                        </label>
                        <textarea
                          id={`response-${request.id}`}
                          name="response"
                          rows={3}
                          className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md"
                          placeholder="Provide a response to this request..."
                          required
                        />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Submit Response
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700">Response</h4>
                    <p className="mt-1 text-sm text-gray-500">{request.response}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SupervisorPanel; 