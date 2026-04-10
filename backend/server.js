import 'dotenv/config'
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import songRoutes from './routes/songRoutes.js';
import cameraRoutes from './routes/cameraRoutes.js';


const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/camera", cameraRoutes);
app.use("/songs", express.static("public/songs"));
app.get("/", (req, res) => {
  res.send("Mood To Music API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});