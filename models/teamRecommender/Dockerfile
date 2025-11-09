# Use Python 3.11 slim (works well with pandas/scikit-learn)
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libopenblas-dev \
    liblapack-dev \
    python3-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app and model
COPY api/ ./api
COPY model/ ./model

WORKDIR /app/api

EXPOSE 5002

CMD ["python", "app.py"]