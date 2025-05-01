import { useState, useEffect } from 'react';
import { knowledgeApi } from '@services/api';
import { KnowledgeEntry } from '../../../shared/types';

const KnowledgeBase = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        setIsLoading(true);
        const data = await knowledgeApi.getAllEntries();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching knowledge base:', err);
        setError('Failed to load knowledge base. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBase();
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
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
                      {entry.sourceRequestId && (
                        <>
                          <span className="mx-2">•</span>
                          <a 
                            href={`/requests/${entry.sourceRequestId}`}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            Source Request
                          </a>
                        </>
                      )}
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