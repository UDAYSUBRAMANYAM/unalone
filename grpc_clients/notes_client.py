import grpc
import os

from proto import notes_pb2
from proto import notes_pb2_grpc


NOTES_GRPC_URL = os.getenv("NOTES_GRPC_URL","localhost:50051")

async def get_nearby_users(user_ids):

    if not user_ids:
        return []

    async with grpc.aio.insecure_channel(
        NOTES_GRPC_URL
    ) as channel:

        client = notes_pb2_grpc.NotesServiceStub(channel)

        response = await client.GetNearbyUsers(
            notes_pb2.NearbyUsersRequest(
                user_ids=user_ids
            )
        )
        return [
            {
                "user_id": user.user_id,
                "username": user.username,
                "note": user.note
            }
            for user in response.users
        ]