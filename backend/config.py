import os
from dotenv import load_dotenv
from pymongo import MongoClient
load_dotenv()

MONGO_URL = os.getenv("mongourl")
if not MONGO_URL:
    raise ValueError("Environment variable 'mongourl' is missing. Please set it in your .env file.")
client = MongoClient(MONGO_URL)

user_db = client["user_db"]
credentials_db = client["credentials_db"]
profile_db = client["profile_db"]
notes_db = client["notes_db"]


users = user_db["users"]

credentials = credentials_db["credentials"]

profiles = profile_db["profiles"]

notes = notes_db["notes"]

credentials.create_index(
    "email",
    unique=True,
)

credentials.create_index(
    "phoneNo",
    unique=True,
)

# One note per user
notes.create_index(
    "user_id",
    unique=True,
)


def check_collections():
    required = {
        "user_db": (user_db, "users"),
        "credentials_db": (credentials_db, "credentials"),
        "profile_db": (profile_db, "profiles"),
        "notes_db": (notes_db, "notes"),
    }

    for db_name, (db, collection_name) in required.items():

        if collection_name in db.list_collection_names():
                f"✓ {db_name}.{collection_name} exists"
            )
        else:
                f"✗ {db_name}.{collection_name} does not exist"
            )


# check_collections()
