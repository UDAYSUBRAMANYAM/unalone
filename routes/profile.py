# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from bson import ObjectId

from config import profiles
from security.auth_service import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me")
def get_my_profile(user_id: str = Depends(get_current_user)):
    pass
