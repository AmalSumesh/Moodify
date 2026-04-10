# 🎧 Moodify

Moodify is a full-stack AI-powered music recommendation app that detects a user's mood and suggests songs accordingly.

It supports **three different mood detection methods**:
- 🧠 Manual Selection  
- 💬 Text-Based Emotion Analysis  
- 📷 Face-Based Emotion Detection (ML Model)  

---

## 🚀 Features

- 🎯 Mood-based song recommendation system  
- 🤖 ML-powered emotion detection  
- 🎥 Face-based mood detection using camera  
- 💬 Text sentiment analysis  
- 🎵 Built-in music player  
- 🔐 Authentication system (login/signup)  
- 🌐 Full-stack architecture (Frontend + Backend + ML)  

---

## 🧠 How It Works

1. User selects a mood detection method:
   - Manual → Direct mood selection  
   - Text → NLP-based emotion detection  
   - Face Scan → ML model predicts emotion  

2. Backend processes the detected mood  

3. Songs are fetched from the database  

4. Music player plays recommended tracks  

---

## 🏗️ Tech Stack

### Frontend
- React.js  
- CSS / Tailwind  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### Machine Learning
- Python  
- Transformers (BERT-based model)  
- gdown (model download)  

---

## 📁 Project Structure

```bash
Moodify/
│
├── backend/
│   ├── config/
│   │   └── db.js
│
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cameraController.js
│   │   ├── moodController.js
│   │   └── songController.js
│
│   ├── middleware/
│   │   └── authMiddleware.js
│
│   ├── models/
│   │   ├── MoodSession.js
│   │   ├── Song.js
│   │   └── User.js
│
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cameraRoutes.js
│   │   ├── moodRoutes.js
│   │   └── songRoutes.js
│
│   ├── seeder/
│   │   └── seedSongs.js
│
│   ├── services/
│
│   ├── public/
│   │   └── songs/
│   │       ├── angry/
│   │       ├── calm/
│   │       ├── energetic/
│   │       ├── happy/
│   │       ├── neutral/
│   │       └── sad/
│
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│
├── ml/
│   ├── model.py
│
├── download_model.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/moodify.git
cd moodify
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 4️⃣ Download ML Model

```bash
python download_model.py
```

---

### 5️⃣ Seed Songs Database

```bash
cd backend/seeder
node seedSongs.js
```

---

## 🔥 Future Improvements

- 🎧 Spotify API integration  
- 📊 Mood history tracking  
- 🧠 Better ML model fine-tuning  
- 📱 Improved UI/UX  

---

## 👨‍💻 Author

Built by **Amal Sumesh**

---

## ⭐ Support

If you like this project, give it a star ⭐ and feel free to contribute!