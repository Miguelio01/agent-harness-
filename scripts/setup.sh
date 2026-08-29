#!/bin/bash
set -e

echo "=== System Setup: Informática y Tributos Harness ==="

# Init git if absent
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized."
fi

# Spin up DB
echo "Starting PostgreSQL..."
docker-compose up -d

# Wait for DB
echo "Waiting for DB to accept connections..."
until docker exec tributos-db pg_isready -U tributos_user -d tributos_db; do
  sleep 1
done

# Initialize tables
echo "Running migrations..."
docker exec -i tributos-db psql -U tributos_user -d tributos_db < db/postgres/init.sql

echo "Installing node dependencies..."
pnpm install

echo "Database configuration and package installation complete."
