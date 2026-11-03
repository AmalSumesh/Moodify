FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8002 \
    HOST=0.0.0.0

WORKDIR /app

# Install lightweight CPU-only PyTorch (slashes container size by >1.5GB)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install application dependencies (ensures CPU wheel is prioritized)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy source code and pre-baked model weights
COPY . .

EXPOSE 8002

CMD ["uvicorn", "text_analyzer:app", "--host", "0.0.0.0", "--port", "8002"]
