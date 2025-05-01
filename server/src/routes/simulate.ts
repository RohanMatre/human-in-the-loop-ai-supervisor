import express from 'express';
import * as simulateController from '../controllers/simulate';

const router = express.Router();

// POST /api/simulate/call - Simulate a customer call
router.post('/call', simulateController.simulateCall);

export default router; 