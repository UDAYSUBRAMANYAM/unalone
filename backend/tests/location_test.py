import asyncio
import json
import math
import random
import time
import uuid
from pathlib import Path

import httpx
import websockets


# ============================================================
# CONFIG
# ============================================================

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000/ws/nearby"

TEST_DURATION = 60
LOCATION_SEND_INTERVAL = 5

PASSWORD = "TestPassword123!"

RESULT_FILE = Path(__file__).parent / "location_test_results.json"


# ============================================================
# TEST LOCATIONS
# ============================================================

CENTER_LAT = 13.320057279090825
CENTER_LNG = 79.58577901124954

TEST_LOCATIONS = [
    {
        "name": "CENTER",
        "latitude": CENTER_LAT,
        "longitude": CENTER_LNG,
        "description": "Testing center location user",
        "expected_nearby": True,
    },
    {
        "name": "EXACT_SAME_LOCATION",
        "latitude": CENTER_LAT,
        "longitude": CENTER_LNG,
        "description": "Testing exact same location",
        "expected_nearby": True,
    },
    {
        "name": "VERY_CLOSE",
        "latitude": 13.325057279090826,
        "longitude": 79.59077901124954,
        "description": "Testing very close user",
        "expected_nearby": True,
    },
    {
        "name": "AROUND_500M",
        "latitude": 13.323557279090826,
        "longitude": CENTER_LNG,
        "description": "Testing approximately 500 meter user",
        "expected_nearby": True,
    },
    {
        "name": "RADIUS_EDGE",
        "latitude": 13.365057279090825,
        "longitude": CENTER_LNG,
        "description": "Testing radius edge user",
        "expected_nearby": True,
    },
]


# ============================================================
# NOTES
# ============================================================

TEST_NOTES = [
    "Testing center location user",
    "Testing exact same location",
    "Testing very close user",
    "Testing approximately 500 meter user",
    "Testing radius edge user",
]


# ============================================================
# HELPERS
# ============================================================

def separator():


def generate_phone():
    """
    Generate an Indian +91 number.

    We deliberately generate only numbers beginning with
    valid Indian mobile prefixes: 6, 7, 8 or 9.
    """

    first_digit = random.choice("6789")
    remaining = "".join(
        random.choice("0123456789")
        for _ in range(9)
    )

    return f"+91{first_digit}{remaining}"


def extract_user_id_from_jwt(token):
    """
    Decode the JWT payload without verifying it.

    We only use this in the test to obtain the user ID
    already issued by our own backend.

    JWT payload is base64url encoded.
    """

    try:
        import base64

        parts = token.split(".")

        if len(parts) != 3:
            raise ValueError("Invalid JWT")

        payload = parts[1]

        padding = "=" * (-len(payload) % 4)

        decoded = base64.urlsafe_b64decode(
            payload + padding
        )

        payload_data = json.loads(
            decoded.decode("utf-8")
        )

        return str(payload_data["sub"])

    except Exception as e:
            "❌ Could not extract user_id from JWT:",
            repr(e),
        )
        return None


# ============================================================
# SIGNUP
# ============================================================

async def signup_user(client, location):
    username = (
        f"location_test_"
        f"{uuid.uuid4().hex[:8]}"
    )

    email = f"{username}@example.com"

    phone_number = generate_phone()

    payload = {
        "email": email,
        "phoneNo": phone_number,
        "username": username,
        "password": PASSWORD,
    }

    separator()


    try:

        response = await client.post(
            f"{BASE_URL}/auth/signup",
            json=payload,
            timeout=15,
        )

            "SIGNUP STATUS:",
            response.status_code,
        )

            "SIGNUP RESPONSE:",
            response.text,
        )

        if response.status_code not in (200, 201):


            return None

        data = response.json()

        access_token = data.get(
            "access_token"
        )

        if not access_token:

                "❌ SIGNUP SUCCEEDED "
                "BUT NO ACCESS TOKEN"
            )

            return None

            "✅ SIGNUP SUCCESS"
        )

            "✅ ACCESS TOKEN RECEIVED "
            "DIRECTLY FROM SIGNUP"
        )

        user_id = extract_user_id_from_jwt(
            access_token
        )

        if not user_id:

                "❌ Could not obtain user_id "
                "from access token"
            )

            return None

            "USER ID:",
            user_id,
        )

        return {
            "user_id": user_id,
            "username": username,
            "email": email,
            "phoneNo": phone_number,
            "password": PASSWORD,
            "token": access_token,

            "location_name": location["name"],
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "description": location["description"],

            "note": None,

            "signup_status": response.status_code,
        }

    except Exception as e:

            "❌ SIGNUP ERROR:",
            repr(e),
        )

        return None


# ============================================================
# CREATE NOTE
# ============================================================

async def create_note(client, user, note_text):
    """
    Create/update the note for one user.

    IMPORTANT:

    The previous test showed:

        /notes/me -> 422

    because the backend expects UserId in the request body.

    Therefore we send:

        {
            "UserId": "<user id>",
            "note": "..."
        }

    and authenticate using:

        Authorization: Bearer <JWT>
    """

    separator()

        "WRITING NOTE FOR:",
        user["username"],
    )

        "USER ID:",
        user["user_id"],
    )

        "NOTE:",
        note_text,
    )

    headers = {
        "Authorization":
            f"Bearer {user['token']}",
        "Content-Type":
            "application/json",
    }

    payload = {
        "UserId": user["user_id"],
        "note": note_text,
    }

        "NOTE PAYLOAD:",
        payload,
    )

        "AUTHORIZATION:",
        "Bearer <JWT>",
    )

    # --------------------------------------------------------
    # Primary endpoint from previous test
    # --------------------------------------------------------

    try:

        response = await client.post(
            f"{BASE_URL}/notes/me",
            headers=headers,
            json=payload,
            timeout=15,
        )

            "NOTE ENDPOINT:",
            "/notes/me",
        )

            "NOTE STATUS:",
            response.status_code,
        )

            "NOTE RESPONSE:",
            response.text,
        )

        if response.status_code in (
            200,
            201,
        ):

                "✅ NOTE CREATED:"
                ,
                user["username"],
            )

            user["note"] = note_text

            return True

            "❌ NOTE CREATION FAILED"
        )

        return False

    except Exception as e:

            "❌ NOTE REQUEST ERROR:",
            repr(e),
        )

        return False


# ============================================================
# DISTANCE
# ============================================================

def haversine_km(
    lat1,
    lng1,
    lat2,
    lng2,
):

    earth_radius_km = 6371.0

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)

    delta_lat = math.radians(
        lat2 - lat1
    )

    delta_lng = math.radians(
        lng2 - lng1
    )

    a = (
        math.sin(delta_lat / 2) ** 2
        +
        math.cos(lat1_rad)
        *
        math.cos(lat2_rad)
        *
        math.sin(delta_lng / 2) ** 2
    )

    c = (
        2
        *
        math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a),
        )
    )

    return earth_radius_km * c


# ============================================================
# WEBSOCKET TEST
# ============================================================

async def websocket_test(
    user,
    results,
    global_start_time,
):
    """
    One independent WebSocket connection.

    Each user:

        connect
        send location
        receive nearby users
        wait 5 sec
        send again

    for 60 seconds.
    """

    username = user["username"]

    token = user["token"]

    latitude = user["latitude"]

    longitude = user["longitude"]

    user_result = {
        "user_id": user["user_id"],
        "username": username,
        "location_name": user["location_name"],

        "latitude": latitude,
        "longitude": longitude,

        "note": user["note"],

        "location_sends": 0,
        "responses": 0,
        "errors": 0,

        "records": [],

        "unique_nearby_users": [],
        "last_nearby_users": [],
    }

    separator()

        "STARTING WEBSOCKET"
    )

        "USER:",
        username,
    )

        "LOCATION:",
        user["location_name"],
    )

        "LAT:",
        latitude,
    )

        "LNG:",
        longitude,
    )

        "URL:",
        WS_URL,
    )

    try:

        ws_url = (
            f"{WS_URL}"
            f"?token={token}"
        )

        async with websockets.connect(
            ws_url,
            open_timeout=15,
            close_timeout=5,
            ping_interval=20,
            ping_timeout=20,
            max_size=10 * 1024 * 1024,
        ) as websocket:

                "✅ WEBSOCKET CONNECTED:",
                username,
            )

            connection_start = time.monotonic()

            next_send = connection_start

            while True:

                now = time.monotonic()

                elapsed = (
                    now - global_start_time
                )

                if elapsed >= TEST_DURATION:
                    break

                # ------------------------------------------------
                # Send location
                # ------------------------------------------------

                if now >= next_send:

                    payload = {
                        "lat": latitude,
                        "lng": longitude,
                    }

                    await websocket.send(
                        json.dumps(payload)
                    )

                    user_result[
                        "location_sends"
                    ] += 1

                        f"[{username}] "
                        f"📤 LOCATION SENT "
                        f"t={elapsed:.2f}s"
                    )

                    next_send = (
                        now
                        +
                        LOCATION_SEND_INTERVAL
                    )

                # ------------------------------------------------
                # Try to receive response
                # ------------------------------------------------

                remaining = max(
                    0.1,
                    min(
                        1.0,
                        TEST_DURATION
                        - elapsed,
                    ),
                )

                try:

                    raw_response = (
                        await asyncio.wait_for(
                            websocket.recv(),
                            timeout=remaining,
                        )
                    )

                    response_time = (
                        time.monotonic()
                        - global_start_time
                    )

                    data = json.loads(
                        raw_response
                    )

                    user_result[
                        "responses"
                    ] += 1

                    nearby_users = []

                    if (
                        isinstance(data, dict)
                        and
                        data.get("type")
                        ==
                        "nearby_users"
                    ):

                        nearby_users = (
                            data.get(
                                "users",
                                []
                            )
                        )

                    user_result[
                        "last_nearby_users"
                    ] = nearby_users

                    # --------------------------------------------
                    # Collect unique users
                    # --------------------------------------------

                    existing_ids = set(
                        user_result[
                            "unique_nearby_users"
                        ]
                    )

                    for nearby in nearby_users:

                        nearby_id = str(
                            nearby.get(
                                "user_id"
                            )
                        )

                        if nearby_id not in existing_ids:

                            user_result[
                                "unique_nearby_users"
                            ].append(
                                nearby_id
                            )

                            existing_ids.add(
                                nearby_id
                            )

                    # --------------------------------------------
                    # Save complete response
                    # --------------------------------------------

                    record = {
                        "timestamp": time.time(),
                        "elapsed_seconds":
                            round(
                                response_time,
                                3,
                            ),

                        "response": data,
                    }

                    user_result[
                        "records"
                    ].append(record)

                        f"[{username}] "
                        f"📥 RECEIVED "
                        f"{len(nearby_users)} USERS"
                    )

                    # Print actual nearby users
                    if nearby_users:

                            json.dumps(
                                nearby_users,
                                indent=2,
                            )
                        )

                except asyncio.TimeoutError:

                    # No response within this
                    # small receive window.

                    await asyncio.sleep(
                        0.05
                    )

                except websockets.ConnectionClosed as e:

                        f"[{username}] "
                        f"❌ CONNECTION CLOSED:",
                        e,
                    )

                    user_result[
                        "errors"
                    ] += 1

                    break

                except json.JSONDecodeError as e:

                        f"[{username}] "
                        f"❌ INVALID JSON:",
                        repr(e),
                    )

                    user_result[
                        "errors"
                    ] += 1

    except Exception as e:

            f"[{username}] "
            f"❌ WEBSOCKET ERROR:",
            repr(e),
        )

        user_result[
            "errors"
        ] += 1

        f"🔴 TEST FINISHED FOR {username}"
    )

    results[username] = user_result


# ============================================================
# CREATE EXPECTED DISTANCE TABLE
# ============================================================

def build_expected_distances(users):

    center = users[0]

    expected = []

    for user in users:

        distance = haversine_km(
            center["latitude"],
            center["longitude"],
            user["latitude"],
            user["longitude"],
        )

        expected.append(
            {
                "from_user":
                    center["username"],

                "to_user":
                    user["username"],

                "distance_km":
                    round(
                        distance,
                        4,
                    ),

                "within_5km":
                    distance <= 5,
            }
        )

    return expected


# ============================================================
# MAIN
# ============================================================

async def main():

    separator()

        "LOKOL LOCATION + NOTES "
        "WEBSOCKET TEST"
    )

    separator()

        "TEST DURATION:",
        TEST_DURATION,
        "seconds",
    )

        "LOCATION SEND INTERVAL:",
        LOCATION_SEND_INTERVAL,
        "seconds",
    )

    separator()

    users = []

    # ========================================================
    # CREATE 5 USERS
    # ========================================================

        "CREATING 5 TEST USERS"
    )

    separator()

    async with httpx.AsyncClient() as client:

        for location in TEST_LOCATIONS:

            user = await signup_user(
                client,
                location,
            )

            if user:

                users.append(user)

            else:

                    "❌ USER CREATION FAILED "
                    "FOR:",
                    location["name"],
                )

    separator()

        "USERS CREATED:",
        len(users),
    )

    if len(users) != 5:

            "❌ Expected 5 users "
            "but got:",
            len(users),
        )

            "Test cannot continue."
        )

        return

    # ========================================================
    # PRINT USERS
    # ========================================================

    for index, user in enumerate(
        users,
        start=1,
    ):

            f"user{index} | "
            f"{user['username']} | "
            f"{user['user_id']} | "
            f"{user['latitude']} "
            f"{user['longitude']} | "
            f"{user['location_name']}"
        )

    # ========================================================
    # CREATE NOTES
    # ========================================================

    separator()

        "WRITING NOTES FOR ALL 5 USERS"
    )

    separator()

    notes_success = 0

    async with httpx.AsyncClient() as client:

        for index, user in enumerate(
            users
        ):

            note_text = TEST_NOTES[index]

            success = await create_note(
                client,
                user,
                note_text,
            )

            if success:

                notes_success += 1

    separator()

        "NOTES WRITTEN:",
        f"{notes_success} / {len(users)}",
    )

    if notes_success != 5:

            "❌ NOT ALL NOTES WERE CREATED."
        )

            "The location test will NOT "
            "continue because we need "
            "notes available for the "
            "gRPC response."
        )

        return

        "✅ ALL 5 NOTES CREATED"
    )

    # ========================================================
    # EXPECTED DISTANCES
    # ========================================================

    separator()

        "EXPECTED DISTANCES"
    )

    separator()

    expected_distances = (
        build_expected_distances(
            users
        )
    )

    for item in expected_distances:

            f"{item['from_user']} "
            f"-> "
            f"{item['to_user']} : "
            f"{item['distance_km']} km "
            f"| within 5km="
            f"{item['within_5km']}"
        )

    # ========================================================
    # START WEBSOCKETS
    # ========================================================

    separator()

        "STARTING 5 WEBSOCKET CONNECTIONS"
    )

        "TEST WILL RUN FOR:",
        TEST_DURATION,
        "SECONDS",
    )

        "LOCATION SEND INTERVAL:",
        LOCATION_SEND_INTERVAL,
        "SECONDS",
    )

    separator()

    results = {}

    global_start_time = time.monotonic()

    tasks = []

    for user in users:

        task = asyncio.create_task(
            websocket_test(
                user,
                results,
                global_start_time,
            )
        )

        tasks.append(task)

    await asyncio.gather(
        *tasks
    )

    # ========================================================
    # FINAL SUMMARY
    # ========================================================

    separator()

        "FINAL TEST SUMMARY"
    )

    separator()

    for user in users:

        username = user["username"]

        result = results.get(
            username
        )

        if not result:
            continue

            "\nUSER:",
            username,
        )

            "USER ID:",
            user["user_id"],
        )

            "LOCATION:",
            user["location_name"],
        )

            "LAT:",
            user["latitude"],
        )

            "LNG:",
            user["longitude"],
        )

            "NOTE:",
            user["note"],
        )

            "LOCATION SENDS:",
            result[
                "location_sends"
            ],
        )

            "RESPONSES:",
            result[
                "responses"
            ],
        )

            "ERRORS:",
            result[
                "errors"
            ],
        )

            "UNIQUE NEARBY USERS:",
            len(
                result[
                    "unique_nearby_users"
                ]
            ),
        )

        if result[
            "unique_nearby_users"
        ]:

                "NEARBY USER IDS:",
                result[
                    "unique_nearby_users"
                ],
            )

        else:

                "NEARBY USER IDS: []"
            )

            "LAST RESPONSE:"
        )

        if result[
            "last_nearby_users"
        ]:

                json.dumps(
                    result[
                        "last_nearby_users"
                    ],
                    indent=2,
                )
            )

        else:

                "[]"
            )

    # ========================================================
    # SAVE COMPLETE RESULTS
    # ========================================================

    final_output = {
        "test": {
            "name":
                "LOKOL LOCATION + NOTES WEBSOCKET TEST",

            "duration_seconds":
                TEST_DURATION,

            "location_send_interval_seconds":
                LOCATION_SEND_INTERVAL,

            "users_count":
                len(users),

            "notes_created":
                notes_success,
        },

        "expected_distances":
            expected_distances,

        "users": [
            {
                "user_id":
                    user["user_id"],

                "username":
                    user["username"],

                "location_name":
                    user["location_name"],

                "latitude":
                    user["latitude"],

                "longitude":
                    user["longitude"],

                "note":
                    user["note"],
            }

            for user in users
        ],

        "results":
            results,
    }

    with open(
        RESULT_FILE,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            final_output,
            file,
            indent=2,
        )

    separator()

        "✅ RESULTS SAVED TO:"
    )

        RESULT_FILE
    )

    separator()

        "🏁 TEST COMPLETE"
    )

    separator()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    try:

        asyncio.run(
            main()
        )

    except KeyboardInterrupt:

            "\n❌ TEST INTERRUPTED"
        )
