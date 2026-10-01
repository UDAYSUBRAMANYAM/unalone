import asyncio
import grpc

from proto import notes_pb2
from proto import notes_pb2_grpc

from config import notes


class NotesService(
    notes_pb2_grpc.NotesServiceServicer
):

    async def GetNearbyUsers(
        self,
        request,
        context
    ):

        user_ids = list(request.user_ids)

        print("Received IDs:", user_ids)

        if not user_ids:
            return notes_pb2.NearbyUsersResponse(users=[])

        documents = list(
            notes.find(
                {
                    "user_id": {
                        "$in": user_ids
                    }
                },
                {
                    "_id": 0,
                    "user_id": 1,
                    "note": 1
                }
            )
        )

        print("MongoDB notes:")
        print(documents)

        users = []

        for document in documents:

            users.append(
                notes_pb2.NearbyUser(
                    user_id=document["user_id"],
                    username="",
                    note=document.get("note", "")
                )
            )

        return notes_pb2.NearbyUsersResponse(
            users=users
        )


async def serve():

    server = grpc.aio.server()

    notes_pb2_grpc.add_NotesServiceServicer_to_server(
        NotesService(),
        server
    )

    server.add_insecure_port("[::]:50051")

    await server.start()

    print("Notes gRPC server running on port 50051")

    await server.wait_for_termination()


if __name__ == "__main__":
    asyncio.run(serve())
