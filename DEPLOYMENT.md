# Deployment Guide

This guide explains how to deploy the blogging application to a VPS using Docker, Nginx, and GitHub Actions CI/CD.

## Prerequisites

- A VPS with Docker and Docker Compose installed
- A domain name pointed to your VPS
- SSH access to your VPS

## VPS Setup

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Clone the Repository

```bash
cd /var/www
sudo git clone <your-repo-url> blogging
cd blogging
sudo chown -R $USER:$USER /var/www/blogging
```

### 3. Configure Environment Variables

```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

Update the following variables:
- `JWT_SECRET`: Generate a strong secret key
- `DATABASE_URL`: Update if needed
- `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY`: Change to secure values
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME`: Set admin credentials
- `MINIO_PUBLIC_URL`: Set to your domain (e.g., `https://yourdomain.com/minio`)

### 4. Start Services

```bash
# Start Docker containers
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Setup MinIO bucket
docker exec minio mc alias set local http://localhost:9000 admin password123
docker exec minio mc mb local/blogging --ignore-existing
docker exec minio mc anonymous set download local/blogging
```

## Nginx Setup

### 1. Install Nginx

```bash
sudo apt install nginx -y
```

### 2. Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx/nginx.conf /etc/nginx/sites-available/blogging

# Update domain name in the config
sudo nano /etc/nginx/sites-available/blogging
# Replace 'your-domain.com' with your actual domain

# Enable site
sudo ln -s /etc/nginx/sites-available/blogging /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## GitHub Actions CI/CD Setup

### 1. Add GitHub Secrets

Go to your GitHub repository settings → Secrets and variables → Actions, and add:

- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USERNAME`: SSH username (usually root or your user)
- `VPS_SSH_KEY`: Your private SSH key

### 2. Generate SSH Key (if needed)

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy public key to VPS
ssh-copy-id user@your-vps-ip

# Copy private key content to GitHub secret VPS_SSH_KEY
cat ~/.ssh/id_rsa
```

### 3. Deployment

The application will automatically deploy when you push to the `main` or `master` branch.

## Manual Deployment Commands

### Build and Deploy

```bash
cd /var/www/blogging
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f minio
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

## Monitoring

### Check Service Status

```bash
docker-compose ps
```

### Database Backup

```bash
# Backup
docker exec postgres-blog pg_dump -U blog-user blog > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i postgres-blog psql -U blog-user blog < backup_20240101.sql
```

## Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose logs app

# Rebuild
docker-compose build --no-cache app
docker-compose up -d app
```

### Database connection issues

```bash
# Check if Postgres is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### MinIO bucket access issues

```bash
# Recreate bucket with public access
docker exec minio mc mb local/blogging --ignore-existing
docker exec minio mc anonymous set download local/blogging
```

## Security Recommendations

1. Change default passwords in `.env`
2. Use strong JWT secret
3. Enable firewall (UFW):
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
4. Regularly update system packages
5. Enable automatic security updates
6. Use SSH keys instead of passwords
7. Consider implementing rate limiting in Nginx

## Useful Docker Commands

```bash
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# View resource usage
docker stats

# Clean up unused images
docker image prune -f

# Clean up everything
docker system prune -a
```
