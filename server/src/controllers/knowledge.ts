import { Request, Response } from 'express';
import * as firebaseService from '../services/firebase-mock';
import * as aiAgentService from '../services/ai-agent';
import logger from '../utils/logger';

// Get all knowledge entries
export const getAllEntries = async (req: Request, res: Response) => {
  try {
    const entries = await firebaseService.getKnowledgeEntries();
    res.status(200).json(entries);
  } catch (error) {
    logger.error('Error getting all knowledge entries', error);
    res.status(500).json({ error: 'Failed to retrieve knowledge entries' });
  }
};

// Create a new knowledge entry
export const createEntry = async (req: Request, res: Response) => {
  try {
    const { query, answer } = req.body;
    
    if (!query || !answer) {
      return res.status(400).json({ error: 'Query and answer are required' });
    }
    
    const entryId = await firebaseService.createKnowledgeEntry({ query, answer });
    
    // Reinitialize the knowledge base to include the new entry
    await aiAgentService.initializeKnowledgeBase();
    
    const entry = {
      id: entryId,
      query,
      answer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json(entry);
  } catch (error) {
    logger.error('Error creating knowledge entry', error);
    res.status(500).json({ error: 'Failed to create knowledge entry' });
  }
};

// Update a knowledge entry
export const updateEntry = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const { query, answer } = req.body;
    
    if (!query && !answer) {
      return res.status(400).json({ error: 'Query or answer must be provided' });
    }
    
    const update: {query?: string, answer?: string} = {};
    if (query) update.query = query;
    if (answer) update.answer = answer;
    
    await firebaseService.updateKnowledgeEntry(entryId, update);
    
    // Reinitialize the knowledge base to include the update
    await aiAgentService.initializeKnowledgeBase();
    
    res.status(200).json({ message: 'Knowledge entry updated successfully' });
  } catch (error) {
    logger.error(`Error updating knowledge entry with ID: ${req.params.id}`, error);
    res.status(500).json({ error: 'Failed to update knowledge entry' });
  }
}; 