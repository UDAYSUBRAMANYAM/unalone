#!/bin/bash

set -e

APP_DIR="$HOME/apps/lokol/backend"

cd "$APP_DIR"

echo "======================================"
echo "||      LOKOL DEPLOYMENT            ||"
echo "======================================"

echo ""
echo "[1/2] Checking Docker..."

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: Docker is not installed."
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "ERROR: Docker Compose is not available."
    exit 1
fi

echo "Docker: $(docker --version)"
echo "Compose: $(docker compose version --short)"
echo "Docker check passed."

echo ""
echo "[2/2] Building and starting services..."

docker compose build --no-cache --pull
docker compose up -d --remove-orphans

echo ""
echo "Services:"
docker compose ps

echo ""
echo "Checking backend..."

sleep 10

if curl -fsS http://127.0.0.1:8000/ >/dev/null; then
    echo "Backend: HEALTHY"
else
    echo "Backend: FAILED"
    docker compose logs --tail=50 backend
    exit 1
fi

echo ""
echo "======================================"
echo "||     DEPLOYMENT SUCCESSFUL        ||"
echo "======================================"