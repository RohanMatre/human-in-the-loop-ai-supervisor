import express from 'express';
import * as knowledgeController from '../controllers/knowledge';

const router = express.Router();

// GET /api/knowledge - Get all knowledge entries
router.get('/', knowledgeController.getAllEntries);

// POST /api/knowledge - Create a new knowledge entry
router.post('/', knowledgeController.createEntry);

// PUT /api/knowledge/:id - Update a knowledge entry
router.put('/:id', knowledgeController.updateEntry);

export default router; 