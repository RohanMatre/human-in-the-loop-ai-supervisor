import { v4 as uuidv4 } from 'uuid';
import { HelpRequest, Conversation, KnowledgeEntry } from '../../../shared/types/index';
import { CONVERSATION_ROLE, REQUEST_STATUS } from '../../../shared/constants/index';
import * as firebaseService from './firebase';
import logger from '../utils/logger';

// Simulated knowledge base for the AI agent
let knowledgeBase: Map<string, string> = new Map();

// Initialize the knowledge base from Firebase
export const initializeKnowledgeBase = async (): Promise<void> => {
  try {
    const entries = await firebaseService.getKnowledgeEntries();
    
    // Clear the current knowledge base
    knowledgeBase.clear();
    
    // Add entries to the knowledge base
    entries.forEach(entry => {
      knowledgeBase.set(entry.query.toLowerCase(), entry.answer);
    });
    
    logger.info(`Knowledge base initialized with ${knowledgeBase.size} entries`);
  } catch (error) {
    logger.error('Error initializing knowledge base', error);
    throw error;
  }
};

// Function to check if the AI knows the answer
const knowsAnswer = (query: string): string | null => {
  // Check for exact match
  const exactMatch = knowledgeBase.get(query.toLowerCase());
  if (exactMatch) return exactMatch;
  
  // Implement fuzzy matching logic here if needed
  // For now, we'll just do a simple substring search
  for (const [knownQuery, answer] of knowledgeBase.entries()) {
    if (query.toLowerCase().includes(knownQuery) || knownQuery.includes(query.toLowerCase())) {
      return answer;
    }
  }
  
  return null;
};

// Simulate an AI response to a customer query
export const processQuery = async (
  query: string,
  customerInfo: { id: string, name: string }
): Promise<{ response: string, requestId?: string }> => {
  try {
    logger.info(`Processing query from customer ${customerInfo.id}: ${query}`);
    
    // Check if the AI knows the answer
    const knownAnswer = knowsAnswer(query);
    
    if (knownAnswer) {
      logger.info(`AI found answer in knowledge base for: ${query}`);
      return { response: knownAnswer };
    }
    
    // AI doesn't know the answer, create a help request
    logger.info(`AI does not know the answer for: ${query}. Creating help request.`);
    
    // Create conversation history
    const conversation: Conversation[] = [
      {
        role: CONVERSATION_ROLE.USER,
        content: query,
        timestamp: new Date().toISOString()
      },
      {
        role: CONVERSATION_ROLE.ASSISTANT,
        content: "Let me check with my supervisor about that...",
        timestamp: new Date().toISOString()
      }
    ];
    
    // Create help request
    const helpRequest: Omit<HelpRequest, 'id'> = {
      query,
      customerInfo,
      status: REQUEST_STATUS.PENDING,
      timestamp: new Date().toISOString(),
      conversation
    };
    
    const requestId = await firebaseService.createRequest(helpRequest);
    
    return { 
      response: "Let me check with my supervisor about that. I'll get back to you shortly.",
      requestId
    };
  } catch (error) {
    logger.error('Error processing query', error);
    throw error;
  }
};

// Function to handle supervisor response to a help request
export const handleSupervisorResponse = async (
  requestId: string,
  response: string
): Promise<void> => {
  try {
    logger.info(`Processing supervisor response for request ${requestId}`);
    
    // Get the original request
    const request = await firebaseService.getRequestById(requestId);
    if (!request) {
      throw new Error(`Request not found: ${requestId}`);
    }
    
    // Update the request with the response
    await firebaseService.updateRequest(requestId, {
      status: REQUEST_STATUS.RESOLVED,
      response,
      conversation: [
        ...(request.conversation || []),
        {
          role: CONVERSATION_ROLE.ASSISTANT,
          content: response,
          timestamp: new Date().toISOString()
        }
      ]
    });
    
    // Add the response to the knowledge base
    const knowledgeEntry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      query: request.query,
      answer: response,
      sourceRequestId: requestId
    };
    
    await firebaseService.createKnowledgeEntry(knowledgeEntry);
    
    // Update the in-memory knowledge base
    knowledgeBase.set(request.query.toLowerCase(), response);
    
    logger.info(`Successfully processed supervisor response for request ${requestId}`);
  } catch (error) {
    logger.error(`Error handling supervisor response for request ${requestId}`, error);
    throw error;
  }
};

// Simulate a phone call
export const simulateCall = async (
  query: string, 
  customerName: string = 'Anonymous Customer'
): Promise<{ conversationLog: string[], requestId?: string }> => {
  try {
    const customerId = `cust_${uuidv4().split('-')[0]}`;
    
    logger.info(`Simulating call from customer ${customerId} (${customerName})`);
    
    const conversationLog: string[] = [
      `Customer ${customerName} (${customerId}): ${query}`
    ];
    
    const { response, requestId } = await processQuery(query, { id: customerId, name: customerName });
    
    conversationLog.push(`AI Agent: ${response}`);
    
    if (requestId) {
      conversationLog.push(`System: Help request created with ID: ${requestId}`);
    }
    
    return { conversationLog, requestId };
  } catch (error) {
    logger.error('Error simulating call', error);
    throw error;
  }
}; 