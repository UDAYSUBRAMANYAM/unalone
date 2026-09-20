# pyrefly: ignore [missing-import]
from fastapi import APIRouter, WebSocket
# pyrefly: ignore [missing-import]
from fastapi import Depends, WebSocketDisconnect
import redis
from config_redis import redis_client
from security.auth_service import get_current_user_ws

router = APIRouter(tags=["Location"])

LOCATION_TTL = 10


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

            await redis_client.hset(
                location_key,
                mapping={
                    "lat": lat,
                    "lng": lng,
                },
            )

            await redis_client.expire(
                location_key,
                LOCATION_TTL,
            )

            await websocket.send_json({
                "status": "location_updated",
            })

    except WebSocketDisconnect:
        pass

    finally:
        await redis_client.delete(location_key)

async def get_user_location(user_id: str):

    result = await redis.geopos(
        "lokol:locations",
        user_id
    )

    if not result or result[0] is None:
        return None

    longitude, latitude = result[0]

    return {
        "lat": latitude,
        "lng": longitude,
    }
@router.websocket("ws/location/nearbyme")
async def nearby_me(ws:WebSocket,user_id = Depends(get_current_user_ws)):
    await ws.accept()
    try:
        curr_location = await get_user_location(user_id)
        if not curr_location:
            await ws.send_json({
                "error":"current location unavailable"
            })
            return
        nearby_users = await get_nearby_users(
        user_id=user_id,
        latitude=curr_location["lat"],
        longitude=curr_location["lng"],
        radius=1000,
        )
        await ws.send_json({
        "type": "nearby_users",
        "users": nearby_users,
    })
    except Exception as error:
        print("NEARBY ERROR:", error)

    finally:
        await ws.close()

from typing import Any


async def get_nearby_users(
    user_id: str,
    latitude: float,
    longitude: float,
    radius: float = 1000,
) -> list[dict[str, Any]]:

    results = await redis.geosearch(
        name="user_locations",
        longitude=longitude,
        latitude=latitude,
        radius=radius,
        unit="m",
        withcoord=True,
        withdist=True,
    )

    nearby_users = []

    for result in results:
        # redis-py returns:
        # (member, distance, (longitude, latitude))
        nearby_user_id, distance, coordinates = result

        nearby_user_id = (
            nearby_user_id.decode()
            if isinstance(nearby_user_id, bytes)
            else nearby_user_id
        )

        # Don't return yourself
        if nearby_user_id == str(user_id):
            continue

        nearby_users.append({
            "user_id": nearby_user_id,
            "distance": round(float(distance)),
            "longitude": float(coordinates[0]),
            "latitude": float(coordinates[1]),
        })

    return nearby_users