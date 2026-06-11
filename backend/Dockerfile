# Build FastAPI environment
FROM python:3.10-slim

# Install system dependencies needed for OpenCV, NumPy, and PDF compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Create uploads directory structure
RUN mkdir -p uploads/scans uploads/reports uploads/explainability

# Expose port
EXPOSE 8000

# Environment variables
ENV DOCKER_ENV=true
ENV PYTHONUNBUFFERED=1

# Start Uvicorn Server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
