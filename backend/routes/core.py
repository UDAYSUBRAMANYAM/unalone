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
    print("\n========================================")
    print("WS HANDLER STARTED")
    print("USER:", user_id)
    print("========================================")

    await websocket.accept()

    print("WS ACCEPTED FOR USER:", user_id)

    presence_key = f"{PRESENCE_PREFIX}{user_id}"

    try:

        # =========================================
        # REDIS CONNECTION CHECK
        # =========================================
        print("🔥🔥🔥 NEW CORE.PY LOADED 🔥🔥🔥")
        redis_status = await redis_client.ping()

        print("REDIS PING:", redis_status)

        # =========================================
        # CONTINUOUS LOCATION LOOP
        # =========================================

        while True:

            print("\n----------------------------------------")
            print("WAITING FOR LOCATION")
            print("USER:", user_id)
            print("----------------------------------------")

            # =====================================
            # RECEIVE LOCATION
            # =====================================

            data = await websocket.receive_json()

            print("LOCATION RECEIVED:", data)

            lat = float(data["lat"])
            lng = float(data["lng"])

            print("LAT:", lat)
            print("LNG:", lng)

            print("LOCATION UPDATE CYCLE START")

            # =====================================
            # REDIS CHECK
            # =====================================

            redis_status = await redis_client.ping()

            print("REDIS PING:", redis_status)

            # =====================================
            # STORE LOCATION
            # =====================================

            geoadd_result = await redis_client.geoadd(
                LOCATION_KEY,
                (lng, lat, str(user_id)),
            )

            print("REDIS GEOADD RESULT:", geoadd_result)
            print("LOCATION STORED FOR USER:", user_id)

            # =====================================
            # VERIFY LOCATION WAS STORED
            # =====================================

            stored_position = await redis_client.geopos(
                LOCATION_KEY,
                str(user_id),
            )

            print(
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

            print(
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

            print(
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

            print(
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

            print(
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

            print(
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

                print(
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

            print(
                "CALLING GRPC WITH USER IDS:",
                nearby_users,
            )

            users = await get_nearby_users(
                nearby_users
            )

            print(
                "GRPC RESPONSE:",
                users,
            )

            # =====================================
            # BUILD RESPONSE
            # =====================================

            result = []

            for user in users:

                uid = str(user["user_id"])

                print(
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

                print(
                    "REDIS POSITION FOR",
                    uid,
                    ":",
                    position,
                )

                if not position:
                    print(
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

                print(
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
            print("\n========== REDIS DEBUG ==========")

            all_users = await redis_client.zrange(
                LOCATION_KEY,
                0,
                -1,
            )

            print("ALL USERS IN GEOSET:")
            for uid in all_users:
                print("  ", uid)

            print("CURRENT USER:", user_id)

            current_position = await redis_client.geopos(
                LOCATION_KEY,
                str(user_id),
            )

            print("CURRENT USER POSITION:", current_position)

            print("=================================\n")
            response = {
                "type": "nearby_users",
                "users": result,
            }

            print(
                "\nSENDING TO FRONTEND:",
                response,
            )

            await websocket.send_json(
                response
            )

            print(
                "LOCATION UPDATE CYCLE COMPLETE"
            )

    # =========================================
    # CLIENT DISCONNECTED
    # =========================================

    except WebSocketDisconnect:

        print("\n========================================")
        print("WEBSOCKET DISCONNECTED")
        print("USER:", user_id)
        print("========================================")

        await redis_client.delete(
            presence_key
        )

        await redis_client.zrem(
            LOCATION_KEY,
            str(user_id),
        )

        print(
            "REMOVED USER FROM REDIS:",
            user_id,
        )

    # =========================================
    # OTHER ERROR
    # =========================================

    except Exception as e:

        print("\n========================================")
        print("WEBSOCKET ERROR")
        print("USER:", user_id)
        print("ERROR:", repr(e))
        print("========================================")

        try:
            await websocket.close()
        except Exception:
            pass