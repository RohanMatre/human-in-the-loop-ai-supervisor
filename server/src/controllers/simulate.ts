import { Request, Response } from 'express';
import * as aiAgentService from '../services/ai-agent';
import logger from '../utils/logger';

// Simulate a call to the AI agent
export const simulateCall = async (req: Request, res: Response) => {
  try {
    const { query, customerName } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const result = await aiAgentService.simulateCall(query, customerName);
    
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error simulating call', error);
    res.status(500).json({ error: 'Failed to simulate call' });
  }
}; 