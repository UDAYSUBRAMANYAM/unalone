from fastapi import APIRouter, WebSocket
from fastapi import Depends, WebSocketDisconnect
from config_redis import redis_client
from security.auth_service import get_current_user_ws

router = APIRouter(tags=["Location"])

LOCATION_TTL = 60


@router.websocket("/ws/location/me")
async def location_websocket(
    websocket: WebSocket,
    user_id: str = Depends(get_current_user_ws),
):
    await websocket.accept()

    location_key = f"location:{user_id}"

    try:
        while True:
            data = await websocket.receive_json()

            lat = data["lat"]
            lng = data["lng"]

            redis_client.hset(
                location_key,
                mapping={
                    "lat": lat,
                    "lng": lng,
                },
            )

            redis_client.expire(
                location_key,
                LOCATION_TTL,
            )

            await websocket.send_json({
                "status": "location_updated",
            })

    except WebSocketDisconnect:
        pass

    finally:
        redis_client.delete(location_key)