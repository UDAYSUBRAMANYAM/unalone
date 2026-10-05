import asyncio
import grpc

from bson import ObjectId
from bson.errors import InvalidId

from proto import notes_pb2
from proto import notes_pb2_grpc

from config import notes, profiles


class NotesService(
    notes_pb2_grpc.NotesServiceServicer
):

    async def GetNearbyUsers(
        self,
        request,
        context
    ):
        user_ids = list(request.user_ids)

        print("========================================")
        print("📥 gRPC GetNearbyUsers")
        print("Received user IDs:", user_ids)
        print("========================================")

        if not user_ids:
            return notes_pb2.NearbyUsersResponse(
                users=[]
            )

        # -----------------------------------------
        # CONVERT STRING IDs → ObjectId
        #
        # profiles.user_id is stored as ObjectId.
        # The gRPC request sends plain strings from Redis.
        # We must convert them to ObjectId before querying
        # the profiles collection.
        #
        # notes.user_id is stored as a plain string (it was
        # inserted via str(user_id) in routes/notes.py).
        # So we keep the original string list for notes.
        # -----------------------------------------

        object_ids = []
        valid_str_ids = []  # strings that parsed successfully

        for uid in user_ids:
            try:
                oid = ObjectId(uid)
                object_ids.append(oid)
                valid_str_ids.append(uid)
            except (InvalidId, TypeError):
                print(f"⚠️  Skipping invalid ObjectId: {uid!r}")

        print("Converted ObjectId list:", object_ids)

        # -----------------------------------------
        # GET NOTES
        #
        # notes.user_id is stored as a plain string.
        # -----------------------------------------

        note_documents = list(
            notes.find(
                {
                    "user_id": {
                        "$in": user_ids   # plain strings
                    }
                },
                {
                    "_id": 0,
                    "user_id": 1,
                    "note": 1
                }
            )
        )

        print("📝 Note documents from MongoDB:", note_documents)

        # -----------------------------------------
        # GET PROFILES
        #
        # profiles.user_id is stored as ObjectId.
        # -----------------------------------------

        profile_documents = list(
            profiles.find(
                {
                    "user_id": {
                        "$in": object_ids  # ObjectIds
                    }
                },
                {
                    "_id": 0,
                    "user_id": 1,
                    "username": 1
                }
            )
        )

        print("👤 Profile documents from MongoDB:", profile_documents)

        # -----------------------------------------
        # CREATE LOOKUPS (both keyed by plain string)
        # -----------------------------------------

        # notes_by_user: str(user_id) → note value
        notes_by_user = {
            str(document["user_id"]): document.get("note")
            for document in note_documents
        }

        # usernames_by_user: str(ObjectId) → username
        # str(ObjectId("68abc...")) gives back "68abc..."
        usernames_by_user = {
            str(document["user_id"]): document.get("username", "")
            for document in profile_documents
        }

        print("notes_by_user lookup:", notes_by_user)
        print("usernames_by_user lookup:", usernames_by_user)

        # -----------------------------------------
        # BUILD gRPC RESPONSE
        # -----------------------------------------

        users = []

        for user_id in user_ids:

            user_id_str = str(user_id)

            username = usernames_by_user.get(
                user_id_str,
                ""
            )

            note = notes_by_user.get(
                user_id_str,
                ""
            )

            users.append(
                notes_pb2.NearbyUser(
                    user_id=user_id_str,
                    username=username or "",
                    note=note or ""
                )
            )

        # -----------------------------------------
        # DEBUG FINAL RESPONSE
        # -----------------------------------------

        print("========================================")
        print("📤 Final gRPC users:")

        for user in users:
            print({
                "user_id": user.user_id,
                "username": user.username,
                "note": user.note
            })

        print("========================================")

        return notes_pb2.NearbyUsersResponse(
            users=users
        )


async def serve():

    server = grpc.aio.server()

    notes_pb2_grpc.add_NotesServiceServicer_to_server(
        NotesService(),
        server
    )

    server.add_insecure_port(
        "[::]:50051"
    )

    await server.start()

    print("🚀 Notes gRPC server running on port 50051")

    await server.wait_for_termination()


if __name__ == "__main__":
    asyncio.run(serve())