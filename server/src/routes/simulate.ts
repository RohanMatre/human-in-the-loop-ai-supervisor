import express from 'express';
import * as simulateController from '../controllers/simulate.js';

const router = express.Router();

// POST /api/simulate/call - Simulate a call to the AI agent
router.post('/call', simulateController.simulateCall);

export default router; 