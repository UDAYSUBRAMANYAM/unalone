# gRPC Nearby Users Architecture

## 1. Problem

### Root Cause 1 — ObjectId vs string mismatch in profiles query

`profile_db.profiles.user_id` is stored as a **BSON `ObjectId`** in MongoDB.
This is because during signup (`routes/auth.py`), the profile is created like:

```python
curr_id = ObjectId()
profile = profileDBschema(_id=ObjectId(), user_id=curr_id, username=data.username)
profiles.insert_one(profile.model_dump(), ...)
```

`model_dump()` on a Pydantic model with `user_id: ObjectId` serialises it as an `ObjectId` object,
which PyMongo stores natively as BSON ObjectId.

Redis stores user IDs as plain strings (e.g. `"68abc123..."`).
The gRPC server was receiving those plain strings and querying MongoDB with:

```python
profiles.find({"user_id": {"$in": user_ids}})   # user_ids = plain strings
```

A plain string `"68abc123..."` does **not** match a BSON `ObjectId("68abc123...")`.
MongoDB silently returned zero documents, so `usernames_by_user` was always empty
and `username` was always `""`.

### Root Cause 2 — notes-grpc container missing env_file

The `docker-compose.yaml` `notes-grpc` service was missing `env_file: .env`.
Without it, the `mongourl` environment variable was not injected into the gRPC container.
`config.py` raises `ValueError("Environment variable 'mongourl' is missing")` on startup,
meaning the gRPC server could not connect to MongoDB at all.

### Why notes worked but profiles did not

`notes_db.notes.user_id` is stored as a **plain string** because `routes/notes.py` inserts:

```python
notes.insert_one({"user_id": user_id, "note": note.note})
```

Where `user_id` comes from `get_current_user()` -> JWT `sub` -> `str(ObjectId)` -> a plain string.
So notes queries with string IDs worked; profile queries with string IDs silently returned nothing.

---

## 2. Existing Architecture

```
React Frontend
    |
    |  WebSocket  ws://backend/ws/nearby?token=<JWT>
    v
FastAPI  (routes/core.py  @router.websocket("/ws/nearby"))
    |  receives lat/lng from client each location update
    |
    +-> Redis GEOADD   store current user location
    +-> Redis GEOSEARCH  find users within 5 km radius
    |
    |  user_ids  (plain strings from Redis zset members)
    |
    v
grpc_clients/notes_client.py  get_nearby_users(user_ids)
    |
    |  gRPC  NearbyUsersRequest{ user_ids: [string] }
    v
notes_service.py  NotesService.GetNearbyUsers()
    |
    +-> profile_db.profiles  (query by ObjectId)  -> username
    +-> notes_db.notes       (query by string)     -> note
    |
    |  gRPC  NearbyUsersResponse{ users: [NearbyUser] }
    v
FastAPI  merges gRPC response with Redis geo positions
    |
    |  JSON WebSocket message
    v
React Frontend  renders nearby users with username + note
```

---

## 3. MongoDB Collections

| Database | Collection | Purpose |
|---|---|---|
| `user_db` | `users` | Core user record: status, timestamps, verification flags |
| `credentials_db` | `credentials` | Login credentials: email, phoneNo, hashed password |
| `profile_db` | `profiles` | User profile: **username**, address, dob, gender, etc. |
| `notes_db` | `notes` | User note: **note** text per user |

**Source of truth for `username`:** `profile_db.profiles.username`

**Source of truth for `note`:** `notes_db.notes.note`

---

## 4. User ID Flow

### Origin

During signup (`routes/auth.py`):

```python
curr_id = ObjectId()          # e.g. ObjectId("68abc123...")
```

### JWT token

The access token is created with:

```python
create_access_token(str(curr_id))   # sub = "68abc123..."
```

`get_current_user()` returns `payload["sub"]` which is a **plain string**.

### Redis

`core.py` stores locations with:

```python
await redis_client.geoadd(LOCATION_KEY, (lng, lat, str(user_id)))
```

Redis members are always **plain strings**.

### MongoDB storage

| Collection | `user_id` type | How stored |
|---|---|---|
| `profile_db.profiles` | `ObjectId` | `profileDBschema(user_id=curr_id)` then `model_dump()` -> BSON ObjectId |
| `notes_db.notes` | `str` | `{"user_id": user_id}` where `user_id` is the JWT sub string |

### ObjectId string conversion

`ObjectId("68abc123...")` and `"68abc123..."` are a lossless roundtrip:
- `ObjectId(string)` parses a 24-char hex string into a BSON ObjectId
- `str(ObjectId)` returns the original 24-char hex string

The gRPC server now converts string IDs to ObjectId before querying `profiles`:

```python
object_ids = [ObjectId(uid) for uid in user_ids]
profiles.find({"user_id": {"$in": object_ids}})
```

And converts back to string for the lookup dictionary:

```python
usernames_by_user = {
    str(doc["user_id"]): doc.get("username", "")
    for doc in profile_documents
}
```

---

## 5. gRPC Client

**File:** `grpc_clients/notes_client.py`

Responsibilities:
1. Opens an insecure gRPC channel to `NOTES_GRPC_URL` (default `localhost:50051`, overridden to `notes-grpc:50051` in Docker)
2. Sends `NearbyUsersRequest(user_ids=[...])` with plain string IDs from Redis
3. Receives `NearbyUsersResponse` containing a list of `NearbyUser` protobuf objects
4. Converts protobuf objects to Python dicts: `{"user_id": ..., "username": ..., "note": ...}`

The client does **not** query MongoDB. All database logic lives in the gRPC server.

---

## 6. gRPC Server

**File:** `notes_service.py`

Responsibilities:
1. Receive `user_ids` (plain strings) from the gRPC request
2. Convert string IDs to `ObjectId` for the `profiles` query (critical fix)
3. Query `profile_db.profiles` with ObjectId IDs to get usernames
4. Query `notes_db.notes` with string IDs to get notes
5. Build lookup dictionaries keyed by plain string IDs
6. Build `NearbyUser` protobuf objects for each user ID
7. Return `NearbyUsersResponse`

---

## 7. MongoDB Queries

### Username from profiles

```python
object_ids = [ObjectId(uid) for uid in user_ids]   # convert strings to ObjectId

profile_documents = list(profiles.find(
    {"user_id": {"$in": object_ids}},    # MUST use ObjectId
    {"_id": 0, "user_id": 1, "username": 1}
))

usernames_by_user = {
    str(doc["user_id"]): doc.get("username", "")   # str(ObjectId) = original hex string
    for doc in profile_documents
}
```

### Note from notes

```python
note_documents = list(notes.find(
    {"user_id": {"$in": user_ids}},    # plain strings work here
    {"_id": 0, "user_id": 1, "note": 1}
))

notes_by_user = {
    str(doc["user_id"]): doc.get("note")
    for doc in note_documents
}
```

---

## 8. Data Merge

After querying both collections, the results are merged by iterating over the original `user_ids`:

```python
for user_id in user_ids:
    user_id_str = str(user_id)
    username = usernames_by_user.get(user_id_str, "")
    note = notes_by_user.get(user_id_str, "")
    users.append(NearbyUser(
        user_id=user_id_str,
        username=username or "",
        note=note or ""
    ))
```

Both lookups are keyed by the same plain string, so they always align correctly
regardless of how MongoDB stored them internally.

---

## 9. Protobuf Contract

**File:** `proto/notes.proto`

```proto
syntax = "proto3";
package notes;

service NotesService {
  rpc GetNearbyUsers (NearbyUsersRequest) returns (NearbyUsersResponse);
}

message NearbyUsersRequest {
  repeated string user_ids = 1;   // plain string hex IDs from Redis
}

message NearbyUser {
  string user_id  = 1;   // plain string hex ID
  string username = 2;   // from profile_db.profiles.username
  string note     = 3;   // from notes_db.notes.note
}

message NearbyUsersResponse {
  repeated NearbyUser users = 1;
}
```

The proto did **not** need modification. The bug was entirely in the Python server logic.

---

## 10. Final Response Example

After the fix, the gRPC response contains:

```json
{
  "user_id": "68abc123456789012345def0",
  "username": "uday",
  "note": "Looking for friends"
}
```

FastAPI adds location coordinates and sends to the frontend:

```json
{
  "type": "nearby_users",
  "users": [
    {
      "user_id": "68abc123456789012345def0",
      "username": "uday",
      "note": "Looking for friends",
      "location": {
        "lat": 0.0012,
        "lng": -0.0008
      }
    }
  ]
}
```

---

## 11. Error Handling

| Scenario | Behaviour |
|---|---|
| User has no profile | `usernames_by_user.get(uid, "")` returns `""` — user still returned |
| User has no username | `doc.get("username", "")` returns `""` — user still returned |
| User has no note | `notes_by_user.get(uid, "")` returns `""` — user still returned |
| Invalid user_id (not 24-char hex) | `ObjectId(uid)` raises `InvalidId`, caught, user skipped from profiles query, warning logged |
| MongoDB document missing entirely | Lookup returns `""` or `None` — user returned with empty fields |
| gRPC server crashes | FastAPI catches exception in WebSocket handler, client receives close event |

---

## 12. Files Changed

### `backend/notes_service.py`

**What changed:**
- Added `from bson import ObjectId` and `from bson.errors import InvalidId` imports
- Added conversion loop: iterate `user_ids`, try `ObjectId(uid)`, collect valid ObjectIds, skip and log any invalid IDs
- Changed `profiles.find()` to use `{"$in": object_ids}` (ObjectId list) instead of `{"$in": user_ids}` (string list)
- `usernames_by_user` now builds correctly because profile documents are actually returned
- Enhanced debug logs: received IDs, converted ObjectId list, note documents, profile documents, lookup dicts, final users

### `backend/docker-compose.yaml`

**What changed:**
- Added `env_file: .env` to the `notes-grpc` service
- Without this line, the gRPC container had no `mongourl` variable, causing `config.py` to raise `ValueError` on startup and preventing MongoDB connectivity entirely

---

## 13. Files Not Changed

| File | Inspected | Reason not changed |
|---|---|---|
| `grpc_clients/notes_client.py` | Yes | Correct. Sends string IDs, returns dicts. No MongoDB queries. |
| `proto/notes.proto` | Yes | Correct. Defines user_id, username, note. No changes needed. |
| `proto/notes_pb2.py` | Yes | Generated file. Proto unchanged so no regeneration needed. |
| `proto/notes_pb2_grpc.py` | Yes | Generated file. Same as above. |
| `config.py` | Yes | Correct. Exports profiles and notes collections properly. |
| `routes/core.py` | Yes | Correct. Reads user["username"] from gRPC response dict. |
| `routes/notes.py` | Yes | Correct. Inserts note with string user_id from JWT. |
| `routes/auth.py` | Yes | Correct. Creates profile with ObjectId user_id during signup. |
| `routes/profile.py` | Yes | Correct. Queries profiles with ObjectId(user_id). |
| `security/auth_service.py` | Yes | Correct. JWT sub is str(ObjectId), returned as string. |
| `frontend/src/pages/LocationPage.jsx` | Yes | Correct. Reads user.username which matches backend response key. |

---

## 14. Testing

### Verification: ObjectId roundtrip

```bash
docker exec lokol-notes-grpc python -c "
from bson import ObjectId
uid = '68abc123456789012345abcd'
oid = ObjectId(uid)
print('str->OID:', oid)
print('OID->str:', str(oid))
print('match:', str(oid) == uid)
"
```

Result:
```
str->OID: 68abc123456789012345abcd
OID->str: 68abc123456789012345abcd
match: True
```

### Verification: Container startup

All three containers confirmed running:
- `lokal-backend`
- `lokol-notes-grpc`
- `redis-lokal`

### Verification: notes_service import

```bash
docker exec lokol-notes-grpc python -c "import notes_service; print('OK')"
# Output: OK
```

### Live test

1. Log in with two accounts that both have usernames in their profiles
2. Open LocationPage in two browser windows
3. Watch `docker logs -f lokol-notes-grpc` for the profile document output
4. The frontend `<h3>` for nearby users should show the actual username

---

## 15. Final Data Flow

```
Redis  (geosearch returns string user IDs)
 |
 v
FastAPI  routes/core.py
 |  calls get_nearby_users(user_ids)
 v
gRPC Client  grpc_clients/notes_client.py
 |  sends NearbyUsersRequest { user_ids: ["68abc...", ...] }
 v
NotesService  notes_service.py
 |
 +-- Convert strings to ObjectId list
 |
 +-- profile_db.profiles
 |    query by ObjectId -> username
 |
 +-- notes_db.notes
      query by string -> note
 |
 v  Merge by str(user_id) key
NearbyUsersResponse { users: [NearbyUser(user_id, username, note)] }
 |
 v
FastAPI  merges with Redis geopos and adds location
 |
 v
WebSocket JSON  { type: "nearby_users", users: [...] }
 |
 v
React  LocationPage.jsx
 renders user.username  (now correctly populated)
```
