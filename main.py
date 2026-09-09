# pyrefly: ignore [missing-import]
from fastapi import FastAPI,APIRouter
from routes.auth import router as auth_router
from routes.profile import router as profile_router
# router = APIRouter()

app = FastAPI()
@auth_router.get('/',tags=['root'])
async def root():
    return {"message":"Server Started"}

app.include_router(auth_router)
app.include_router(profile_router)