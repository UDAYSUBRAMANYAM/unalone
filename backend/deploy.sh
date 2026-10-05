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
echo "Checking frontend..."

if curl -fsS http://127.0.0.1:3000/ >/dev/null; then
    echo "Frontend: HEALTHY"
else
    echo "Frontend: FAILED"
    echo ""
    docker compose logs --tail=50 frontend
    exit 1
fi


echo ""
echo "Checking Redis..."

if docker compose exec -T redis redis-cli ping | grep -q "PONG"; then
    echo "Redis: HEALTHY"
else
    echo "Redis: FAILED"
    docker compose logs --tail=50 redis
    exit 1
fi


echo ""
echo "======================================"
echo "||     DEPLOYMENT SUCCESSFUL        ||"
echo "======================================"
echo "|| Commit: $COMMIT                  ||"
echo "======================================"