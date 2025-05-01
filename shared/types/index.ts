export interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export type RequestStatus = 'pending' | 'resolved' | 'timeout';

export interface Conversation {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HelpRequest {
  id: string;
  query: string;
  customerInfo: CustomerInfo;
  status: RequestStatus;
  timestamp: string;
  response?: string;
  responseTimestamp?: string;
  conversation?: Conversation[];
}

export interface KnowledgeEntry {
  id: string;
  query: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  sourceRequestId?: string;
}

export interface Stats {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  responseRate: number;
  avgResponseTime?: number;
} 