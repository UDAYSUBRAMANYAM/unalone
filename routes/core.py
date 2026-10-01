from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from config_redis import redis_client
from security.auth_service import get_current_user_ws
from grpc_clients.notes_client import get_nearby_users


router = APIRouter(tags=["sync_location"])

LOCATION_KEY = "lokol:locations"
PRESENCE_PREFIX = "lokol:presence:"

LOCATION_RADIUS_KM = 5
PRESENCE_TTL = 30

@router.websocket("/ws/nearby")
async def nearby_location_ws(
    websocket: WebSocket,
    user_id: str = Depends(get_current_user_ws)):
    await websocket.accept()
    presence_key = f"{PRESENCE_PREFIX}{user_id}"
    try:
        while True:
            data = await websocket.receive_json()
            lat = float(data["lat"])
            lng = float(data["lng"])
            await redis_client.geoadd(LOCATION_KEY,(lng, lat, str(user_id)))
            await redis_client.set(presence_key,"1",ex=PRESENCE_TTL)
            nearby_users = await redis_client.geosearch(
                LOCATION_KEY,
                longitude=lng,
                latitude=lat,
                radius=LOCATION_RADIUS_KM,
                unit="km"
            )
            nearby_users = [
                uid for uid in nearby_users
                if uid != str(user_id)
            ]
            users = await get_nearby_users(nearby_users)
            print("REDIS USERS:", nearby_users)
            print("CALLING GRPC NOW...")
            result = []
            for user in users:
                uid = user["user_id"]
                position = await redis_client.geopos(LOCATION_KEY,uid)
                if not position:
                    continue
                nearby_lng = float(position[0][0])
                nearby_lat = float(position[0][1])

                relative_lat = nearby_lat - lat
                relative_lng = nearby_lng - lng
                result.append({
                    "user_id": uid,
                    "username": user["username"],
                    "note": user["note"],
                    "location": {
                        "lat": relative_lat,
                        "lng": relative_lng
                    }
                })
            await websocket.send_json({"type": "nearby_users","users": result})
    except WebSocketDisconnect:
        await redis_client.delete(presence_key)
        await redis_client.zrem(LOCATION_KEY,str(user_id))
