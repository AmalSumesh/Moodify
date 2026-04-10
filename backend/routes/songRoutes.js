import express from 'express';
import { createSong, getSongsByMood } from '../controllers/songController.js';  

const router = express.Router();

// Route: POST /api/songs
router.post('/', createSong);

// Route: GET /api/songs/mood/:mood
router.get('/mood/:mood', getSongsByMood);

export default router;
