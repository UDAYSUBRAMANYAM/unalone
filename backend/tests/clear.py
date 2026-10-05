import os

from dotenv import load_dotenv
from pymongo import MongoClient


# Load backend/.env
load_dotenv()


# Your backend uses lowercase "mongourl"
MONGO_URL = os.getenv("mongourl")

if not MONGO_URL:
    raise ValueError(
        "Environment variable 'mongourl' is missing."
    )


# Connect to MongoDB
client = MongoClient(MONGO_URL)

# EXACT database names from your config.py
DATABASES = {
    "user_db": ["users"],
    "credentials_db": ["credentials"],
    "profile_db": ["profiles"],
    "notes_db": ["notes"],
}


def main():

    print()
    print("=" * 50)
    print("LOKOL DATABASE CLEANUP")
    print("=" * 50)

    print("\nDatabases that will be cleared:")

    for db_name, collections in DATABASES.items():
        print(f"  {db_name}")
        for collection in collections:
            print(f"      └── {collection}")

    print()
    print("⚠️ WARNING")
    print("This will DELETE ALL DOCUMENTS")
    print("from the collections above.")
    print()

    confirmation = input(
        "Type DELETE to continue: "
    )

    if confirmation != "DELETE":
        print("\n❌ Cleanup cancelled.")
        client.close()
        return

    try:

        # Verify MongoDB connection
        client.admin.command("ping")

        print("\n✅ MongoDB connection successful")

        total_deleted = 0

        # --------------------------------------------------
        # CLEAR DATABASES
        # --------------------------------------------------

        for db_name, collections in DATABASES.items():

            db = client[db_name]

            print()
            print(f"--- Clearing {db_name} ---")

            for collection_name in collections:

                collection = db[collection_name]

                count_before = collection.count_documents({})

                print(
                    f"{db_name}.{collection_name}"
                )

                print(
                    f"Documents before: {count_before}"
                )

                if count_before == 0:
                    print("Nothing to delete.")
                    continue

                result = collection.delete_many({})

                print(
                    f"Deleted: {result.deleted_count}"
                )

                total_deleted += result.deleted_count

        # --------------------------------------------------
        # VERIFY
        # --------------------------------------------------

        print()
        print("=" * 50)
        print("VERIFYING DATABASES")
        print("=" * 50)

        everything_clean = True

        for db_name, collections in DATABASES.items():

            db = client[db_name]

            for collection_name in collections:

                collection = db[collection_name]

                remaining = collection.count_documents({})

                if remaining == 0:

                    print(
                        f"✅ {db_name}.{collection_name}: EMPTY"
                    )

                else:

                    everything_clean = False

                    print(
                        f"❌ {db_name}.{collection_name}: "
                        f"{remaining} documents remaining"
                    )

        print()
        print("=" * 50)

        if everything_clean:
            print(
                f"✅ CLEANUP COMPLETE"
            )
            print(
                f"Total documents deleted: {total_deleted}"
            )
        else:
            print(
                "⚠️ Some documents are still present."
            )

        print("=" * 50)

    except Exception as e:

        print()
        print("❌ MongoDB ERROR:")
        print(e)

    finally:

        client.close()


if __name__ == "__main__":
    main()