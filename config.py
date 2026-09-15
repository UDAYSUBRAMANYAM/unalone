# pyrefly: ignore [missing-import]
from pymongo import MongoClient
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
load_dotenv()

uri = os.getenv("mongourl")
if not uri:
    raise ValueError("Environment variable 'mongourl' is missing. Please set it in your .env file or environment.")
client = MongoClient(uri)

user_db = client["user_db"]
credentials_db = client["credentials_db"]
profile_db = client["profile_db"]

users = user_db["users"]
credentials = credentials_db["credentials"]
profiles = profile_db["profiles"]

credentials.create_index("email", unique=True)
credentials.create_index("phoneNo", unique=True)

def check_collections():
    required = {
        "user_db": (user_db, "users"),
        "credentials_db": (credentials_db, "credentials"),
        "profile_db": (profile_db, "profiles"),
    }

    for db_name, (db, collection_name) in required.items():
        if collection_name in db.list_collection_names():
            print(f"✓ {db_name}.{collection_name} exists")
        else:
            print(f"✗ {db_name}.{collection_name} does not exist")


# check_collections()