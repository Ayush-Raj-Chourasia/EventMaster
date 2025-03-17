#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs
mkdir -p ssl

# Check for SSL certificates
if [ ! -f ssl/certificate.crt ] || [ ! -f ssl/private.key ]; then
    echo "Warning: SSL certificates not found in ssl directory!"
    echo "Please place your SSL certificates in the ssl directory:"
    echo "  - ssl/certificate.crt"
    echo "  - ssl/private.key"
    exit 1
fi

# Build and deploy using Docker Compose
echo "Building and deploying with Docker Compose..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be up
echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking service status..."
if docker-compose ps | grep -q "Exit"; then
    echo "Error: Some services failed to start!"
    docker-compose logs
    exit 1
fi

# Run database migrations
echo "Running database migrations..."
docker-compose exec app npm run db:push

echo "Deployment completed successfully!"
echo "Your application should now be running at:"
echo "  - Frontend: https://your-domain.com"
echo "  - API: https://your-domain.com/api"
echo ""
echo "Please check the logs directory for any issues." 