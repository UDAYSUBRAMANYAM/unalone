#!/bin/bash

set -e

APP_DIR="$HOME/apps/lokol"

cd "$APP_DIR"

echo "======================================"
echo "||        LOKOL DEPLOYMENT          ||"
echo "======================================"

# ============================================================
# 1. CHECK DOCKER
# ============================================================

echo ""
echo "[1/4] Checking Docker..."

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

# ============================================================
# 2. PULL LATEST CODE
# ============================================================

echo ""
echo "[2/4] Pulling latest code..."

git fetch --all --prune

CURRENT_BRANCH=$(git branch --show-current)

git pull origin "$CURRENT_BRANCH"

COMMIT=$(git rev-parse --short HEAD)

echo "Branch : $CURRENT_BRANCH"
echo "Commit : $COMMIT"

# ============================================================
# 3. BACKEND
# ============================================================

echo ""
echo "[3/4] Deploying backend..."

cd "$APP_DIR/backend"

docker compose build --pull

docker compose up -d --remove-orphans

echo "Backend started."

# ============================================================
# 4. FRONTEND
# ============================================================

echo ""
echo "[4/4] Deploying frontend..."

cd "$APP_DIR/frontend"

docker compose build --pull

docker compose up -d --remove-orphans

echo "Frontend started."

# ============================================================
# STATUS
# ============================================================

echo ""
echo "======================================"
echo "||        CONTAINER STATUS          ||"
echo "======================================"

echo ""
echo "Backend:"
cd "$APP_DIR/backend"
docker compose ps

echo ""
echo "Frontend:"
cd "$APP_DIR/frontend"
docker compose ps

echo ""
echo "======================================"
echo "||     DEPLOYMENT SUCCESSFUL        ||"
echo "======================================"
echo "|| Commit: $COMMIT                  ||"
echo "======================================"