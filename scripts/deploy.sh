#!/usr/bin/env bash
set -euo pipefail
echo "==================================="
echo "Starting deployment to production"
echo "==================================="

cd /var/www/blogging

echo "Pulling latest scripts and configs..."
sudo git pull origin master

echo "Setting script permissions..."
chmod +x /var/www/blogging/scripts/ops/*.sh
chmod +x /var/www/blogging/scripts/*.sh

echo "Pulling latest Docker images..."
sudo docker compose -f docker-compose.prod.yml pull

echo "Starting services..."
sudo docker compose -f docker-compose.prod.yml up -d --force-recreate

echo "Checking service status..."
sudo docker compose -f docker-compose.prod.yml ps

echo "Pruning old Docker images..."
sudo docker image prune -f

echo "==================================="
echo "Deployment completed successfully!"
echo "==================================="
