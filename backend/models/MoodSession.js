import mongoose from 'mongoose';

const moodSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mood: {
    type: String,
    required: [true, 'Please add a mood'],
    lowercase: true,
    trim: true,
    enum: ["happy","sad","angry","calm","energetic","neutral"]
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
        },
    ],
    modelVersion: {
        type: String,
        default: 'mock_v1',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('MoodSession', moodSessionSchema);
