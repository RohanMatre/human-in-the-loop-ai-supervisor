import { Request, Response } from 'express';
import * as firebaseService from '../services/firebase.js';
import * as aiAgentService from '../services/ai-agent.js';
import logger from '../utils/logger.js';

// Get all requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await firebaseService.getRequests();
    res.status(200).json(requests);
  } catch (error) {
    logger.error('Error getting all requests', error);
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
};

// Get pending requests
export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const requests = await firebaseService.getPendingRequests();
    res.status(200).json(requests);
  } catch (error) {
    logger.error('Error getting pending requests', error);
    res.status(500).json({ error: 'Failed to retrieve pending requests' });
  }
};

// Get a specific request by ID
export const getRequestById = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const request = await firebaseService.getRequestById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.status(200).json(request);
  } catch (error) {
    logger.error(`Error getting request with ID: ${req.params.id}`, error);
    res.status(500).json({ error: 'Failed to retrieve request' });
  }
};

// Submit a supervisor response to a request
export const submitResponse = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({ error: 'Response is required' });
    }
    
    // Check if request exists
    const request = await firebaseService.getRequestById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Handle the supervisor response
    await aiAgentService.handleSupervisorResponse(requestId, response);
    
    // Get the updated request
    const updatedRequest = await firebaseService.getRequestById(requestId);
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    logger.error(`Error submitting response for request ID: ${req.params.id}`, error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
}; 