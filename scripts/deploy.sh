#!/usr/bin/env bash
set -euo pipefail

echo "==================================="
echo "Starting deployment to production"
echo "==================================="

cd /var/www/blogging

echo "Pulling latest code..."
git pull origin master

echo "Pulling latest Docker images..."
docker compose -f docker-compose.prod.yml pull

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

echo "Checking service status..."
docker compose -f docker-compose.prod.yml ps

echo "Pruning old Docker images..."
docker image prune -f

echo "==================================="
echo "Deployment completed successfully!"
echo "==================================="
