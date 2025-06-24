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

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend

COPY --from=frontend-build /src/build ./backend/frontend/build

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
