import { Request, Response } from 'express';
import * as firebaseService from '../services/firebase-mock';
import logger from '../utils/logger';

// Get system statistics
export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await firebaseService.getStats();
    res.status(200).json(stats);
  } catch (error) {
    logger.error('Error getting system statistics', error);
    res.status(500).json({ error: 'Failed to retrieve system statistics' });
  }
}; 