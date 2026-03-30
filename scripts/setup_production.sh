#!/bin/bash

# NVHome Secure Production Setup Script
# This script configures environment variables and restarts the containers securely.

# 1. Generate Secure Secrets (if not already set)
if [ ! -f .env ]; then
    echo "Creating new .env file with secure secrets..."
    
    # Generate random strings for secrets
    DB_PASS=$(openssl rand -base64 24)
    JWT_SEC=$(openssl rand -base64 32)
    ADMIN_PASS=$(openssl rand -base64 16)

    cat <<EOF > .env
# Database
DB_PASSWORD=$DB_PASS

# Backend Security
JWT_SECRET=$JWT_SEC
ADMIN_EMAIL=admin@nvhome.vn
ADMIN_PASSWORD=$ADMIN_PASS

# External APIs (PLEASE FILL THESE MANUALLY)
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
RECAPTCHA_SECRET_KEY=YOUR_RECAPTCHA_KEY_HERE
EOF
    echo "SUCCESS: .env created. PLEASE EDIT .env to add your actual Telegram/ReCaptcha tokens."
else
    echo "INFO: .env already exists. Skipping creation."
fi

# 2. Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# 3. Pull latest code (Assumes git is configured)
# git pull origin main

# 4. Build and Start
echo "Starting secure production environment..."
docker-compose up -d --build

# 5. Clean up Docker images (to save space)
docker image prune -f

echo "--------------------------------------------------"
echo "DEPLOYMENT COMPLETE!"
echo "Your Admin Email: admin@nvhome.vn"
echo "Your Generated Admin Password: $(grep ADMIN_PASSWORD .env | cut -d'=' -f2)"
echo "--------------------------------------------------"
echo "IMPORTANT: Save the ADMIN_PASSWORD and edit .env for Telegram/ReCaptcha."
