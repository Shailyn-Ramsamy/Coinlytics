# ---------- Stage 1: Build React Frontend ----------
FROM node:18 AS frontend-build
WORKDIR /src
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Build & bundle Python Backend + Static ----------
FROM python:3.11-slim
WORKDIR /app

# 1) Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copy backend code
COPY backend/ ./backend

# 3) Copy React build
COPY --from=frontend-build /src/build ./backend/frontend/build

# Cloud Run expects you to listen on $PORT
ENV PORT=8080
EXPOSE 8080

# 4) Launch Uvicorn pointing at the module path for your app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
