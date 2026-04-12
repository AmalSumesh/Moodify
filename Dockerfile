# BASE IMAGE
FROM node:20-bullseye

# SYSTEM DEPENDENCIES
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# WORKDIR
WORKDIR /app

# BACKEND DEPENDENCIES (CACHE OPTIMIZED)
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# FRONTEND DEPENDENCIES (CACHE OPTIMIZED)
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

# COPY FULL PROJECT
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY ml ./ml

# ML SETUP
WORKDIR /app/ml
RUN pip3 install --no-cache-dir \
    tensorflow==2.13.0 \
    keras==2.13.1 \
    deepface==0.0.79 \
    flask \
    opencv-python \
    numpy

# EXPOSE PORTS
EXPOSE 5000 5001 5173

# START SERVICES
WORKDIR /app

CMD ["bash", "-c", "\
cd ml && python3 run.py & \
cd backend && npm run dev & \
cd frontend && npm run dev -- --host & \
wait"]