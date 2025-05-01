import express from 'express';
import * as statsController from '../controllers/stats.js';

const router = express.Router();

// GET /api/stats - Get system statistics
router.get('/', statsController.getStats);

export default router; 