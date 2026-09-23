from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from config import profiles,credentials,users,client
from schemas.Database import ProfileUpdateSchema
from security.auth_service import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/me")
def get_my_profile(user_id: str = Depends(get_current_user)):
    profile = profiles.find_one({"user_id":ObjectId(user_id)})
    if not profile:
        raise HTTPException(status_code=404,detail="Profile not found")
    profile["_id"] = str(profile["_id"])
    profile["user_id"] = str(profile["user_id"])
    return profile

@router.patch("/me")
def update_profile(data: ProfileUpdateSchema, user_id: str = Depends(get_current_user)):
    profile = profiles.find_one({"user_id":ObjectId(user_id)})
    if not profile:
        raise HTTPException(status_code=404,detail="Profile not found")
    update_data = data.model_dump(exclude_unset=True,mode="json")
    if not update_data:
        raise HTTPException(status_code=400,detail="No fields to update")
    profiles.update_one({"_id": profile["_id"]},{"$set": update_data})
    return {"message": "Profile updated successfully"}

@router.delete("/me")
def delete_profile(user_id:str =Depends(get_current_user)):
    profile = profiles.find_one({"user_id":ObjectId(user_id)})
    if not profile:
        raise HTTPException(status_code=404,detail="profile not found")
    with client.start_session() as session:
        with session.start_transaction():

            profiles.delete_one({"_id": profile["_id"]},session=session)
            credentials.delete_one({"user_id": ObjectId(user_id)}, session=session)
            users.delete_one({"_id": ObjectId(user_id)},session=session)
    return{"message":"profile deleted successfully"}