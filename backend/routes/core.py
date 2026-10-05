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
    user_id: str = Depends(get_current_user_ws),
):

    await websocket.accept()


    presence_key = f"{PRESENCE_PREFIX}{user_id}"

    try:

        # =========================================
        # REDIS CONNECTION CHECK
        # =========================================
        redis_status = await redis_client.ping()


        # =========================================
        # CONTINUOUS LOCATION LOOP
        # =========================================

        while True:


            # =====================================
            # RECEIVE LOCATION
            # =====================================

            data = await websocket.receive_json()


            lat = float(data["lat"])
            lng = float(data["lng"])



            # =====================================
            # REDIS CHECK
            # =====================================

            redis_status = await redis_client.ping()


            # =====================================
            # STORE LOCATION
            # =====================================

            geoadd_result = await redis_client.geoadd(
                LOCATION_KEY,
                (lng, lat, str(user_id)),
            )


            # =====================================
            # VERIFY LOCATION WAS STORED
            # =====================================

            stored_position = await redis_client.geopos(
                LOCATION_KEY,
                str(user_id),
            )

                "REDIS GEOPOS FOR CURRENT USER:",
                stored_position,
            )

            # =====================================
            # PRESENCE
            # =====================================

            await redis_client.set(
                presence_key,
                "1",
                ex=PRESENCE_TTL,
            )

                "PRESENCE UPDATED:",
                user_id,
                "TTL:",
                PRESENCE_TTL,
            )

            # =====================================
            # VERIFY PRESENCE TTL
            # =====================================

            presence_ttl = await redis_client.ttl(
                presence_key
            )

                "PRESENCE TTL:",
                presence_ttl,
            )

            # =====================================
            # CHECK ALL REDIS LOCATION MEMBERS
            # =====================================

            all_location_users = await redis_client.zrange(
                LOCATION_KEY,
                0,
                -1,
            )

                "ALL USERS CURRENTLY IN REDIS:",
                all_location_users,
            )

            # =====================================
            # GEOSEARCH
            # =====================================

            nearby_users = await redis_client.geosearch(
                LOCATION_KEY,
                longitude=lng,
                latitude=lat,
                radius=LOCATION_RADIUS_KM,
                unit="km",
            )

                "REDIS GEOSEARCH RESULT:",
                nearby_users,
            )

            # =====================================
            # REMOVE CURRENT USER
            # =====================================

            nearby_users = [
                uid
                for uid in nearby_users
                if uid != str(user_id)
            ]

                "NEARBY USERS AFTER SELF FILTER:",
                nearby_users,
            )

            # =====================================
            # CHECK DISTANCE TO EACH USER
            # =====================================

            for nearby_uid in nearby_users:

                distance = await redis_client.geodist(
                    LOCATION_KEY,
                    str(user_id),
                    str(nearby_uid),
                    unit="m",
                )

                    "DISTANCE:",
                    user_id,
                    "<->",
                    nearby_uid,
                    "=",
                    distance,
                    "meters",
                )

            # =====================================
            # GRPC
            # =====================================

                "CALLING GRPC WITH USER IDS:",
                nearby_users,
            )

            users = await get_nearby_users(
                nearby_users
            )

                "GRPC RESPONSE:",
                users,
            )

            # =====================================
            # BUILD RESPONSE
            # =====================================

            result = []

            for user in users:

                uid = str(user["user_id"])

                    "\nPROCESSING USER:",
                    uid,
                )

                # ---------------------------------
                # Get Redis position
                # ---------------------------------

                position = await redis_client.geopos(
                    LOCATION_KEY,
                    uid,
                )

                    "REDIS POSITION FOR",
                    uid,
                    ":",
                    position,
                )

                if not position:
                        "NO REDIS POSITION FOUND FOR:",
                        uid,
                    )
                    continue

                nearby_lng = float(
                    position[0][0]
                )

                nearby_lat = float(
                    position[0][1]
                )

                # ---------------------------------
                # Relative location
                # ---------------------------------

                relative_lat = (
                    nearby_lat - lat
                )

                relative_lng = (
                    nearby_lng - lng
                )

                    "RELATIVE LOCATION FOR",
                    uid,
                    ":",
                    {
                        "lat": relative_lat,
                        "lng": relative_lng,
                    },
                )

                # ---------------------------------
                # Add user
                # ---------------------------------

                result.append(
                    {
                        "user_id": uid,
                        "username": user["username"],
                        "note": user.get("note"),
                        "location": {
                            "lat": relative_lat,
                            "lng": relative_lng,
                        },
                    }
                )

            # =====================================
            # SEND RESPONSE
            # =====================================

            all_users = await redis_client.zrange(
                LOCATION_KEY,
                0,
                -1,
            )

            for uid in all_users:


            current_position = await redis_client.geopos(
                LOCATION_KEY,
                str(user_id),
            )


            response = {
                "type": "nearby_users",
                "users": result,
            }

                "\nSENDING TO FRONTEND:",
                response,
            )

            await websocket.send_json(
                response
            )

                "LOCATION UPDATE CYCLE COMPLETE"
            )

    # =========================================
    # CLIENT DISCONNECTED
    # =========================================

    except WebSocketDisconnect:


        await redis_client.delete(
            presence_key
        )

        await redis_client.zrem(
            LOCATION_KEY,
            str(user_id),
        )

            "REMOVED USER FROM REDIS:",
            user_id,
        )

    # =========================================
    # OTHER ERROR
    # =========================================

    except Exception as e:


        try:
            await websocket.close()
        except Exception:
            pass
