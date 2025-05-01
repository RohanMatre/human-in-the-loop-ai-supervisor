import axios from 'axios';
import { HelpRequest, KnowledgeEntry, Stats } from '../../../shared/types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Requests API
export const requestsApi = {
  // Get all requests
  getAllRequests: async (): Promise<HelpRequest[]> => {
    const response = await api.get('/api/requests');
    return response.data;
  },
  
  // Get pending requests
  getPendingRequests: async (): Promise<HelpRequest[]> => {
    const response = await api.get('/api/requests/pending');
    return response.data;
  },
  
  // Get a specific request by ID
  getRequestById: async (id: string): Promise<HelpRequest> => {
    const response = await api.get(`/api/requests/${id}`);
    return response.data;
  },
  
  // Submit a supervisor response to a request
  submitResponse: async (id: string, response: string): Promise<HelpRequest> => {
    const res = await api.post(`/api/requests/${id}/response`, { response });
    return res.data;
  }
};

// Knowledge API
export const knowledgeApi = {
  // Get all knowledge entries
  getAllEntries: async (): Promise<KnowledgeEntry[]> => {
    const response = await api.get('/api/knowledge');
    return response.data;
  },
  
  // Create a new knowledge entry
  createEntry: async (query: string, answer: string): Promise<KnowledgeEntry> => {
    const response = await api.post('/api/knowledge', { query, answer });
    return response.data;
  },
  
  // Update a knowledge entry
  updateEntry: async (id: string, data: { query?: string, answer?: string }): Promise<void> => {
    await api.put(`/api/knowledge/${id}`, data);
  }
};

// Stats API
export const statsApi = {
  // Get system statistics
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/api/stats');
    return response.data;
  }
};

// Simulation API
export const simulateApi = {
  // Simulate a call to the AI agent
  simulateCall: async (query: string, customerName?: string): Promise<{ conversationLog: string[], requestId?: string }> => {
    const response = await api.post('/api/simulate/call', { query, customerName });
    return response.data;
  }
}; 