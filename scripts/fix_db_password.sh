#!/bin/bash
# Move to project directory
cd ~/nvhome

# Get the password from .env
DB_PASS=$(grep DB_PASSWORD .env | cut -d'=' -f2)

# Set the password in Postgres container
docker exec -i nvhome_db psql -U postgres -c "ALTER USER postgres WITH PASSWORD '$DB_PASS';"

# Restart backend
docker restart nvhome_backend

echo "SUCCESS: Database password updated to match .env and backend restarted."
