"""Analyze text and predict its associated emotion using a transformer model."""

import os
from pathlib import Path
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Moodify ML Emotion Analyzer", version="1.0.0")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = os.environ.get("MODEL_PATH", str(BASE_DIR / "public" / "emotion_bert_multilabel"))

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

model.to(device)
model.eval()

# Statically defined 28 labels of the GoEmotions simplified taxonomy
# Eliminates external Hugging Face network requests on container cold start (<2s)
GO_EMOTIONS_LABELS = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
    "confusion", "curiosity", "desire", "disappointment", "disapproval",
    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
    "joy", "love", "nervousness", "optimism", "pride", "realization",
    "relief", "remorse", "sadness", "surprise", "neutral"
]
id_to_label = {i: GO_EMOTIONS_LABELS[i] for i in range(len(GO_EMOTIONS_LABELS))}

emotion_map = {
    "joy": "happy",
    "sadness": "sad",
    "anger": "angry",
    "fear": "neutral",
    "disgust": "angry",
    "surprise": "energetic",
    "admiration": "happy",
    "amusement": "happy",
    "annoyance": "angry",
    "approval": "happy",
    "caring": "happy",
    "confusion": "neutral",
    "curiosity": "energetic",
    "desire": "energetic",
    "disappointment": "sad",
    "disapproval": "angry",
    "embarrassment": "neutral",
    "excitement": "energetic",
    "gratitude": "happy",
    "grief": "sad",
    "love": "happy",
    "nervousness": "neutral",
    "optimism": "happy",
    "pride": "happy",
    "realization": "neutral",
    "relief": "calm",
    "remorse": "sad",
    "neutral": "neutral",
}


class TextInput(BaseModel):
    """Represent the text submitted for emotion prediction."""

    text: str


def predict(text, threshold=0.3):
    """Predict emotions whose model probabilities exceed the threshold."""
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.sigmoid(outputs.logits)[0]

    results = [
        (id_to_label[i], float(probs[i]))
        for i in range(len(probs))
        if probs[i] > threshold
    ]

    results.sort(key=lambda x: x[1], reverse=True)
    return results


@app.get("/")
@app.get("/health")
def health():
    """Health check endpoint for Azure Container Apps liveness/readiness probes."""
    return {
        "status": "healthy",
        "service": "moodify-ml",
        "device": str(device),
    }


@app.post("/predict")
def predict_emotion(data: TextInput):
    """Return the mapped emotion predicted from the submitted text."""
    predictions = predict(data.text)

    if not predictions:
        return {"emotion": "neutral"}

    top_emotion = predictions[0][0]
    mapped_emotion = emotion_map.get(top_emotion, "neutral")
    return {"emotion": mapped_emotion}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8002))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run(
        app,
        host=host,
        port=port,
    )
