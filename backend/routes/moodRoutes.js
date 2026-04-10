import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { detectMood, getMoodHistory, deleteMoodSession, aiAnalysis } from '../controllers/moodController.js';

const router = express.Router();
// Route: POST /api/mood/detect
// Protected by JWT middleware
router.post('/detect', protect, detectMood);
router.get('/history', protect, getMoodHistory);
router.delete('/:id', protect, deleteMoodSession);
router.post('/ai-analysis', protect, aiAnalysis);

export default router;
