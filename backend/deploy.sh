#!/bin/bash

set -e

APP_DIR="$HOME/apps/lokol"

cd "$APP_DIR"

echo "======================================"
echo "||      LOKOL DEPLOYMENT            ||"
echo "======================================"

# ============================================================
# 1. CHECK DOCKER
# ============================================================

echo ""
echo "[1/3] Checking Docker..."

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


# ============================================================
# 2. PULL + BUILD + DEPLOY
# ============================================================

echo ""
echo "[2/3] Pulling latest code..."

git fetch --all --prune

CURRENT_BRANCH=$(git branch --show-current)

git pull origin "$CURRENT_BRANCH"

COMMIT=$(git rev-parse --short HEAD)

echo "Branch : $CURRENT_BRANCH"
echo "Commit : $COMMIT"


echo ""
echo "Building Docker images..."

docker compose build --no-cache --pull

echo "Docker images built successfully."


echo ""
echo "Starting services..."

docker compose up -d --remove-orphans

echo "Services started."


# ============================================================
# 3. HEALTH CHECK
# ============================================================

echo ""
echo "[3/3] Checking services..."

sleep 5

docker compose ps

echo ""
echo "Checking backend..."

if curl -fsS http://127.0.0.1:8000/ >/dev/null; then
    echo "Backend: HEALTHY"
else
    echo "Backend: FAILED"
    echo ""
    docker compose logs --tail=50 backend
    exit 1
fi


echo ""
echo "======================================"
echo "||     DEPLOYMENT SUCCESSFUL        ||"
echo "======================================"
echo "||Commit: $COMMIT                   ||"
echo "======================================"
