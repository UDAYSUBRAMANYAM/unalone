# pyrefly: ignore [missing-import]
from fastapi import FastAPI,APIRouter
# pyrefly: ignore [missing-import]
from fastapi import WebSocket
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.core import router as core_router
# router = APIRouter()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/",tags=["root"])
def root():
    return {"message":"Server Started"}

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(core_router)