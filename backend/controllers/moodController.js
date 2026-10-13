const MoodSession = require('../models/MoodSession');
const Song = require('../models/Song');
const Groq = require("groq-sdk");
const axios = require("axios");

// @desc    Detect mood and recommend songs
// @route   POST /api/mood/detect
// @access  Private
const detectMood = async (req, res) => {
    try {
        const { mood } = req.body;

        if (!mood) {
            return res.status(400).json({ message: 'Please provide a mood' });
        }

        const normalizedMood = mood.toLowerCase();

        // Fetch songs matching the mood
        const recommendedSongs = await Song.find({ mood: normalizedMood }).lean();

        // Save the mood session asynchronously so user response is not delayed
        MoodSession.create({
            user: req.user._id,
            mood: normalizedMood,
            songs: recommendedSongs.map((song) => song._id),
            modelVersion: 'mock_v1',
        }).catch((err) => console.error('Error logging mood session:', err));

        res.status(200).json({
            mood: normalizedMood,
            modelVersion: 'mock_v1',
            recommendedSongs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get mood history for logged in user
// @route   GET /api/mood/history
// @access  Private
const getMoodHistory = async (req, res) => {
    try {
        const sessions = await MoodSession.find({ user: req.user._id })
            .populate('songs')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a mood session
// @route   DELETE /api/mood/history/:id
// @access  Private
const deleteMoodSession = async (req, res) => {
    try {
        const session = await MoodSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Check user ownership
        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await MoodSession.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Session removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const aiAnalysis = async (req, res) => {
    const allowedMoods = ["happy", "sad", "angry", "calm", "energetic", "neutral"];

    let detectedMood;
    let modelVersion = "groq_llama_v1";

    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Please provide text input" });
        }

        const candidateModels = [
            process.env.GROQ_MODEL,
            "openai/gpt-oss-120b",
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-20b"
        ].filter(Boolean);

        let aiResponse;
        let lastError;

        const systemPrompt = "You are an emotion classifier for a music recommendation app. Analyze the user's state or thoughts and respond with ONLY ONE word: happy, sad, angry, calm, energetic, or neutral.";

        for (const candidateModel of candidateModels) {
            try {
                aiResponse = await groq.chat.completions.create({
                    model: candidateModel,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 150,
                });

                const content = (aiResponse.choices[0]?.message?.content || "").trim().toLowerCase();
                const match = content.match(/\b(happy|sad|angry|calm|energetic|neutral)\b/);

                if (match) {
                    detectedMood = match[1];
                    modelVersion = `groq_${candidateModel}`;
                    break;
                } else {
                    throw new Error(`Model returned no valid mood in content`);
                }
            } catch (err) {
                lastError = err;
                // Try next model if current model fails, refuses, or is decommissioned
                continue;
            }
        }

        if (!detectedMood) {
            throw lastError || new Error("All Groq model attempts failed");
        }

    } 
    catch (error){
        console.log("Groq failed, falling back to BERT:", error.message);
        try {
            const { text } = req.body;

            const bertResponse = await axios.post(
                "http://localhost:8002/predict",
                { text }
            );

            detectedMood = bertResponse.data.emotion.toLowerCase();
            modelVersion = "bert_fallback_v1";

            if (!allowedMoods.includes(detectedMood)) {
                detectedMood = "neutral";
            }

        } 
        catch (bertError){
            console.error("BERT Error:", bertError.message || bertError);
            console.log("Defaulting to neutral mood");
            detectedMood = "neutral";
            modelVersion = "fallback_v1";
        }
    }

    try {
        const recommendedSongs = await Song.find({ mood: detectedMood }).lean();

        MoodSession.create({
            user: req.user._id,
            mood: detectedMood,
            songs: recommendedSongs.map(song => song._id),
            modelVersion,
        }).catch((err) => console.error("Error logging AI mood session:", err));

        return res.status(200).json({
            mood: detectedMood,
            modelVersion,
            recommendedSongs,
        });

    } 
    catch (dbError){
        console.error("Database Error:", dbError.message);
        return res.status(500).json({ message: "Database Error", error: dbError.message });
    }
};


module.exports = {
    detectMood,
    getMoodHistory,
    deleteMoodSession,
    aiAnalysis,
};
