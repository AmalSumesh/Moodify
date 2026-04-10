import express from 'express';
import protect from '../middleware/authMiddleware.js';
import detectCameraMood from '../controllers/cameraController.js';

const router = express.Router();

router.post("/detect-camera", protect, detectCameraMood);

export default router;