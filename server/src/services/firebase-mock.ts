import { HelpRequest, KnowledgeEntry, Stats } from '../../../shared/types/index';
import logger from '../utils/logger';

// Mock data
const mockRequests: Record<string, HelpRequest> = {};
const mockKnowledge: Record<string, KnowledgeEntry> = {};

// Initialize Firebase mock
export const initializeFirebase = () => {
  logger.info('Firebase mock initialized successfully');
};

// Request collection operations
export const getRequests = async (): Promise<HelpRequest[]> => {
  logger.info('Mock: Getting all requests');
  return Object.values(mockRequests);
};

export const getPendingRequests = async (): Promise<HelpRequest[]> => {
  logger.info('Mock: Getting pending requests');
  return Object.values(mockRequests).filter(r => r.status === 'pending');
};

export const getRequestById = async (id: string): Promise<HelpRequest | null> => {
  logger.info(`Mock: Getting request with ID: ${id}`);
  return mockRequests[id] || null;
};

export const createRequest = async (request: Omit<HelpRequest, 'id'>): Promise<string> => {
  const id = `req_${Date.now()}`;
  mockRequests[id] = {
    ...request,
    id,
    timestamp: new Date().toISOString()
  };
  logger.info(`Mock: Created new request with ID: ${id}`);
  return id;
};

export const updateRequest = async (id: string, update: Partial<HelpRequest>): Promise<void> => {
  if (mockRequests[id]) {
    mockRequests[id] = {
      ...mockRequests[id],
      ...update,
      ...(update.status === 'resolved' ? { responseTimestamp: new Date().toISOString() } : {})
    };
    logger.info(`Mock: Updated request with ID: ${id}`);
  } else {
    throw new Error(`Request not found: ${id}`);
  }
};

// Knowledge base operations
export const getKnowledgeEntries = async (): Promise<KnowledgeEntry[]> => {
  logger.info('Mock: Getting knowledge entries');
  return Object.values(mockKnowledge);
};

export const createKnowledgeEntry = async (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const id = `know_${Date.now()}`;
  const now = new Date().toISOString();
  mockKnowledge[id] = {
    ...entry,
    id,
    createdAt: now,
    updatedAt: now
  };
  logger.info(`Mock: Created new knowledge entry with ID: ${id}`);
  return id;
};

export const updateKnowledgeEntry = async (id: string, update: Partial<KnowledgeEntry>): Promise<void> => {
  if (mockKnowledge[id]) {
    mockKnowledge[id] = {
      ...mockKnowledge[id],
      ...update,
      updatedAt: new Date().toISOString()
    };
    logger.info(`Mock: Updated knowledge entry with ID: ${id}`);
  } else {
    throw new Error(`Knowledge entry not found: ${id}`);
  }
};

// Stats operations
export const getStats = async (): Promise<Stats> => {
  logger.info('Mock: Getting stats');
  const allRequests = Object.values(mockRequests);
  const pendingRequests = allRequests.filter(r => r.status === 'pending').length;
  const resolvedRequests = allRequests.filter(r => r.status === 'resolved').length;
  const totalRequests = allRequests.length;
  
  return {
    totalRequests,
    pendingRequests,
    resolvedRequests,
    responseRate: totalRequests > 0 ? (resolvedRequests / totalRequests) * 100 : 0,
    avgResponseTime: 5000 // Mock 5 seconds response time
  };
}; 