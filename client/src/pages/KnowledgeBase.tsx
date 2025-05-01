import { useState, useEffect } from 'react';

interface KnowledgeEntry {
  id: string;
  query: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

const KnowledgeBase = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading knowledge base entries from the server
    const timer = setTimeout(() => {
      const mockEntries: KnowledgeEntry[] = [
        {
          id: '1',
          query: 'How do I reset my password?',
          answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          query: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          query: 'How do I track my order?',
          answer: 'You can track your order by going to your account page and clicking on the "Orders" tab. Then select the order you want to track and click on "Track Order".',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setEntries(mockEntries);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredEntries = searchTerm
    ? entries.filter(entry => 
        entry.query.toLowerCase().includes(searchTerm.toLowerCase()) || 
        entry.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : entries;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-500">Loading knowledge base...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="mt-1 text-gray-500">Learned answers from supervisor responses</p>
      </div>

      <div className="mb-6">
        <div className="max-w-lg">
          <label htmlFor="search" className="sr-only">Search Knowledge Base</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="search"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search queries and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <p className="text-gray-500">
            {searchTerm ? 'No matching entries found.' : 'No knowledge base entries yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <li key={entry.id} className="px-4 py-5 sm:px-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{entry.query}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p className="mb-2">{entry.answer}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>Added: {new Date(entry.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Last updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase; 