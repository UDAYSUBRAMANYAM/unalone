# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
# pyrefly: ignore [missing-import]
from bson import ObjectId
from config import profiles,users

router = APIRouter(prefix="/get_user", tags=["Profile"])

@router.get("/users/{user_id}")
def get_user(user_id: str):
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        profile = profiles.find_one({"user_id": ObjectId(user_id)})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        return {
            "user_id": str(user["_id"]),
            "username": profile.get("username"),
            "email_verified": user.get("email_verified", False),
            "phone_verified": user.get("phone_verified", False),
            "profile_verified": user.get("profile_verified", False),
            "joined_at": user.get("created_at"),
            "status": user.get("status"),
            "about_me": profile.get("about"),
            "profile_pic": profile.get("profile_pic"),
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch user")