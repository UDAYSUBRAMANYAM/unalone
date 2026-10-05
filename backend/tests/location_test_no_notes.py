import asyncio
import json
import uuid
from datetime import datetime

import httpx
import websockets


# ============================================================
# CONFIG
# ============================================================

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000/ws/nearby"

PASSWORD = "TestPassword123!"

TEST_DURATION_SECONDS = 60


# ============================================================
# TEST LOCATIONS
# ============================================================
#
# CENTER
# EXACT_SAME_LOCATION -> same coordinates as CENTER
# VERY_CLOSE          -> ~700m away
# AROUND_500M         -> ~700m away in another direction
# RADIUS_EDGE         -> approximately 5km away
#
# You can change these later if required.
#

CENTER_LAT = 13.320057279090825
CENTER_LNG = 79.58577901124954

TEST_LOCATIONS = [
    {
        "name": "CENTER",
        "latitude": CENTER_LAT,
        "longitude": CENTER_LNG,
    },
    {
        "name": "EXACT_SAME_LOCATION",
        "latitude": CENTER_LAT,
        "longitude": CENTER_LNG,
    },
    {
        "name": "VERY_CLOSE",
        "latitude": CENTER_LAT + 0.005,
        "longitude": CENTER_LNG + 0.005,
    },
    {
        "name": "AROUND_500M",
        "latitude": CENTER_LAT + 0.004,
        "longitude": CENTER_LNG - 0.005,
    },
    {
        "name": "RADIUS_EDGE",
        "latitude": CENTER_LAT + 0.045,
        "longitude": CENTER_LNG,
    },
]


# ============================================================
# HELPERS
# ============================================================

def print_separator():


def generate_phone():
    """
    Generate a valid-looking Indian phone number.

    Your backend uses phone validation, so the number must
    start with +91 followed by a valid 10-digit mobile number.
    """

    valid_prefixes = [
        "6",
        "7",
        "8",
        "9",
    ]

    prefix = valid_prefixes[
        uuid.uuid4().int % len(valid_prefixes)
    ]

    remaining = str(
        uuid.uuid4().int % 1000000000
    ).zfill(9)

    return f"+91{prefix}{remaining}"


# ============================================================
# SIGNUP
# ============================================================

async def signup_user(client, location):
    username = (
        f"location_test_"
        f"{uuid.uuid4().hex[:8]}"
    )

    email = f"{username}@example.com"

    phone = generate_phone()

    payload = {
        "email": email,
        "phoneNo": phone,
        "username": username,
        "password": PASSWORD,
    }

    print_separator()


    try:

        response = await client.post(
            f"{BASE_URL}/auth/signup",
            json=payload,
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

        access_token = data.get("access_token")

        if not access_token:

                "❌ SIGNUP SUCCESS BUT NO ACCESS TOKEN"
            )

            return None


        return {
            "username": username,
            "email": email,
            "phoneNo": phone,
            "password": PASSWORD,
            "access_token": access_token,

            "location_name": location["name"],
            "latitude": location["latitude"],
            "longitude": location["longitude"],
        }

    except Exception as e:

            "❌ SIGNUP ERROR:",
            repr(e),
        )

        return None


# ============================================================
# LOGIN
# ============================================================

async def login_user(client, user):

    print_separator()

        "LOGGING IN:",
        user["username"],
    )

    # --------------------------------------------------------
    # Try username / identifier login first
    # --------------------------------------------------------

    identifier_payload = {
        "identifier": user["username"],
        "password": user["password"],
    }

    try:

        response = await client.post(
            f"{BASE_URL}/auth/login",
            json=identifier_payload,
        )

            "IDENTIFIER LOGIN STATUS:",
            response.status_code,
        )

            "IDENTIFIER LOGIN RESPONSE:",
            response.text,
        )

        if response.status_code == 200:

            data = response.json()

            token = data.get("access_token")

            if token:

                    "✅ IDENTIFIER LOGIN SUCCESS"
                )

                user["access_token"] = token

                return user

    except Exception as e:

            "IDENTIFIER LOGIN ERROR:",
            repr(e),
        )

        "⚠️ Identifier login failed."
    )

    # --------------------------------------------------------
    # Try email/password
    # --------------------------------------------------------

    email_payload = {
        "email": user["email"],
        "password": user["password"],
    }

    try:

        response = await client.post(
            f"{BASE_URL}/auth/login",
            json=email_payload,
        )

            "EMAIL LOGIN STATUS:",
            response.status_code,
        )

            "EMAIL LOGIN RESPONSE:",
            response.text,
        )

        if response.status_code == 200:

            data = response.json()

            token = data.get("access_token")

            if token:

                    "✅ EMAIL LOGIN SUCCESS"
                )

                user["access_token"] = token

                return user

    except Exception as e:

            "EMAIL LOGIN ERROR:",
            repr(e),
        )


    return None


# ============================================================
# CREATE WEBSOCKET CONNECTION
# ============================================================

async def connect_user(user):

    token = user["access_token"]

    ws_url = (
        f"{WS_URL}"
        f"?token={token}"
    )

    print_separator()

        "CONNECTING WEBSOCKET:",
        user["username"],
    )

        "LOCATION:",
        user["location_name"],
    )

    try:

        websocket = await websockets.connect(
            ws_url,
            ping_interval=20,
            ping_timeout=20,
        )

            "✅ WEBSOCKET CONNECTED:",
            user["username"],
        )

        return websocket

    except Exception as e:

            "❌ WEBSOCKET CONNECTION FAILED:",
            user["username"],
            repr(e),
        )

        return None


# ============================================================
# SEND LOCATION
# ============================================================

async def send_location(
    websocket,
    user,
):

    payload = {
        "lat": user["latitude"],
        "lng": user["longitude"],
    }

        "📤 SENDING LOCATION:",
        user["username"],
        payload,
    )

    await websocket.send(
        json.dumps(payload)
    )


# ============================================================
# RECEIVE NEARBY USERS
# ============================================================

async def receive_results(
    websocket,
    user,
    results,
    stop_event,
):

    while not stop_event.is_set():

        try:

            message = await asyncio.wait_for(
                websocket.recv(),
                timeout=2,
            )

            timestamp = (
                datetime.now()
                .isoformat()
            )

            data = json.loads(message)

            print_separator()

                "📥 RESPONSE:",
                user["username"],
            )

                "TIME:",
                timestamp,
            )

                json.dumps(
                    data,
                    indent=2,
                )
            )

            # ------------------------------------------------
            # Validate expected response
            # ------------------------------------------------

            if data.get("type") != "nearby_users":

                    "⚠️ Unexpected response type:",
                    data.get("type"),
                )

                continue

            nearby_users = data.get(
                "users",
                [],
            )

            # ------------------------------------------------
            # Save complete result
            # ------------------------------------------------

            results.append(
                {
                    "timestamp": timestamp,
                    "requesting_user": user["username"],
                    "requesting_location": {
                        "name": user["location_name"],
                        "lat": user["latitude"],
                        "lng": user["longitude"],
                    },
                    "nearby_users": nearby_users,
                }
            )

            # ------------------------------------------------
            # Print nearby users clearly
            # ------------------------------------------------

            if not nearby_users:

                    "👥 NO NEARBY USERS"
                )

            else:

                    "👥 NEARBY USERS:"
                )

                for nearby in nearby_users:

                        "   USER:",
                        nearby.get("username"),
                    )

                        "   ID:",
                        nearby.get("user_id"),
                    )

                        "   NOTE:",
                        nearby.get("note"),
                    )

                        "   RELATIVE LOCATION:",
                        nearby.get("location"),
                    )


        except asyncio.TimeoutError:

            continue

        except websockets.exceptions.ConnectionClosed:

                "🔴 WEBSOCKET CLOSED:",
                user["username"],
            )

            break

        except Exception as e:

                "❌ RECEIVE ERROR:",
                user["username"],
                repr(e),
            )

            break


# ============================================================
# USER LOCATION LOOP
# ============================================================

async def run_user(
    user,
    results,
    stop_event,
):

    websocket = await connect_user(
        user
    )

    if websocket is None:

        return

    try:

        # ----------------------------------------------------
        # Initial location
        # ----------------------------------------------------

        await send_location(
            websocket,
            user,
        )

        # ----------------------------------------------------
        # Keep sending location every 5 seconds
        # ----------------------------------------------------

        async def sender():

            while not stop_event.is_set():

                try:

                    await asyncio.sleep(5)

                    if stop_event.is_set():
                        break

                    await send_location(
                        websocket,
                        user,
                    )

                except Exception as e:

                        "❌ LOCATION SEND ERROR:",
                        user["username"],
                        repr(e),
                    )

                    break

        sender_task = asyncio.create_task(
            sender()
        )

        receiver_task = asyncio.create_task(
            receive_results(
                websocket,
                user,
                results,
                stop_event,
            )
        )

        await asyncio.gather(
            sender_task,
            receiver_task,
        )

    except Exception as e:

            "❌ USER TEST ERROR:",
            user["username"],
            repr(e),
        )

    finally:

        try:
            await websocket.close()
        except Exception:
            pass

            "🔴 CLOSED:",
            user["username"],
        )


# ============================================================
# ANALYZE RESULTS
# ============================================================

def analyze_results(
    users,
    results,
):

    print_separator()

        "RESULT ANALYSIS"
    )

    print_separator()

    # --------------------------------------------------------
    # Basic statistics
    # --------------------------------------------------------

        "TOTAL USERS:",
        len(users),
    )

        "TOTAL RESPONSE RECORDS:",
        len(results),
    )

    # --------------------------------------------------------
    # Group by requesting user
    # --------------------------------------------------------

    grouped = {}

    for record in results:

        username = record[
            "requesting_user"
        ]["username"]

        grouped.setdefault(
            username,
            [],
        ).append(record)

    # --------------------------------------------------------
    # Print each user's observations
    # --------------------------------------------------------

    for user in users:

        username = user["username"]

        user_records = grouped.get(
            username,
            [],
        )

        print_separator()

            "REQUESTING USER:",
            username,
        )

            "TEST LOCATION:",
            user["location_name"],
        )

            "RESPONSES RECEIVED:",
            len(user_records),
        )

        if not user_records:

                "❌ NO RESPONSES"
            )

            continue

        # Show last response
        last_response = user_records[-1]

        nearby = last_response[
            "nearby_users"
        ]

            "LAST RESPONSE USERS:",
            len(nearby),
        )

        for nearby_user in nearby:

                "   👤",
                nearby_user.get(
                    "username"
                ),
            )

                "      NOTE:",
                nearby_user.get(
                    "note"
                ),
            )

                "      LOCATION:",
                nearby_user.get(
                    "location"
                ),
            )


# ============================================================
# SAVE RESULTS
# ============================================================

def save_results(
    users,
    results,
):

    output = {

        "test": (
            "LOKOL LOCATION "
            "TEST WITHOUT NOTES"
        ),

        "duration_seconds":
            TEST_DURATION_SECONDS,

        "created_at":
            datetime.now().isoformat(),

        "users": [],

        "results": results,
    }

    # --------------------------------------------------------
    # DO NOT SAVE PASSWORDS OR TOKENS
    # --------------------------------------------------------

    for user in users:

        output["users"].append(
            {
                "username":
                    user["username"],

                "email":
                    user["email"],

                "location_name":
                    user["location_name"],

                "latitude":
                    user["latitude"],

                "longitude":
                    user["longitude"],
            }
        )

    with open(
        "location_test_results.json",
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            output,
            file,
            indent=2,
        )

    print_separator()

        "✅ RESULTS SAVED TO:"
    )

        "location_test_results.json"
    )


# ============================================================
# MAIN
# ============================================================

async def main():

    print_separator()

        "LOKOL LOCATION + GRPC TEST"
    )

        "NO NOTES CREATED"
    )

        "5 USERS"
    )

        "5 DIFFERENT LOCATION CASES"
    )

        f"RUNNING FOR {TEST_DURATION_SECONDS} SECONDS"
    )

    print_separator()

    users = []

    # ========================================================
    # CREATE USERS
    # ========================================================

        "CREATING 5 TEST USERS"
    )

    async with httpx.AsyncClient(
        timeout=20,
    ) as client:

        for location in TEST_LOCATIONS:

            user = await signup_user(
                client,
                location,
            )

            if user is None:

                    "❌ USER CREATION FAILED"
                )

                continue

            # ------------------------------------------------
            # IMPORTANT:
            #
            # Signup already returns access_token,
            # so we use that token directly.
            #
            # We DON'T need another login.
            # ------------------------------------------------

            users.append(user)

    print_separator()

        "USERS CREATED:",
        len(users),
    )

    for index, user in enumerate(
        users,
        start=1,
    ):

            f"user{index} | "
            f"{user['username']} | "
            f"{user['location_name']} | "
            f"{user['latitude']} "
            f"{user['longitude']}"
        )

    if len(users) != 5:

        print_separator()

            "❌ Expected 5 users "
            f"but only got {len(users)}"
        )

            "Test cannot continue."
        )

        return

    # ========================================================
    # CONNECT ALL USERS
    # ========================================================

    print_separator()

        "CONNECTING ALL 5 USERS"
    )

    results = []

    stop_event = asyncio.Event()

    tasks = []

    for user in users:

        task = asyncio.create_task(
            run_user(
                user,
                results,
                stop_event,
            )
        )

        tasks.append(task)

        # Small delay so connections
        # don't all hit backend at exactly
        # the same instant.

        await asyncio.sleep(0.5)

    # ========================================================
    # RUN FOR ONE MINUTE
    # ========================================================

    print_separator()

        "🚀 TEST STARTED"
    )

        f"⏱️ Running for "
        f"{TEST_DURATION_SECONDS} seconds..."
    )

    try:

        await asyncio.sleep(
            TEST_DURATION_SECONDS
        )

    finally:

        stop_event.set()

    # ========================================================
    # WAIT FOR ALL USERS
    # ========================================================

    print_separator()

        "STOPPING TEST"
    )

    await asyncio.gather(
        *tasks,
        return_exceptions=True,
    )

    # ========================================================
    # ANALYZE
    # ========================================================

    analyze_results(
        users,
        results,
    )

    # ========================================================
    # SAVE
    # ========================================================

    save_results(
        users,
        results,
    )

    # ========================================================
    # FINAL
    # ========================================================

    print_separator()

        "✅ TEST COMPLETE"
    )

        "Users tested:",
        len(users),
    )

        "Responses collected:",
        len(results),
    )

        "Output:",
        "location_test_results.json",
    )

    print_separator()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    asyncio.run(
        main()
    )
