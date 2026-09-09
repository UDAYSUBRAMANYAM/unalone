# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from bson import ObjectId

from config import profiles
from security.auth_service import get_current_user
router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me")
def get_my_profile(user_id: str = Depends(get_current_user)):
    profile = profiles.find_one({"user_id":user_id})
    if not profile:
        raise HTTPException(status_code=404,detail="Profile not found")
    return profile
