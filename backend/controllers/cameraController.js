import detectEmotionFromML from "../services/mlService.js"; "../services/mlService.js";
import Song from "../models/Song.js";
import MoodSession from "../models/MoodSession.js";

const detectCameraMood = async (req, res) => {

  try {

    const { image } = req.body;

    const emotion = await detectEmotionFromML(image);

    const songs = await Song.find({ mood: emotion });

    // save history
    const session = await MoodSession.create({
      user: req.user._id,
      mood: emotion,
      songs: songs.map(s => s._id),
      modelVersion: "camera_v1"
    });

    res.json({
      mood: emotion,
      recommendedSongs: songs
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Camera detection failed"
    });

  }

};

export default detectCameraMood;