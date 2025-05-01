import express from 'express';
import * as requestsController from '../controllers/requests';

const router = express.Router();

// GET /api/requests - Get all requests
router.get('/', requestsController.getAllRequests);

// GET /api/requests/pending - Get pending requests
router.get('/pending', requestsController.getPendingRequests);

// GET /api/requests/:id - Get a specific request by ID
router.get('/:id', requestsController.getRequestById);

// POST /api/requests/:id/response - Submit a supervisor response to a request
router.post('/:id/response', requestsController.submitResponse);

export default router; 