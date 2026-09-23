from fastapi import FastAPI,APIRouter
from fastapi import WebSocket
from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.location import router as location_router
# router = APIRouter()

app = FastAPI()
@app.get('/',tags=['root'])
def root():
    return {"message":"Server Started"}

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(location_router)