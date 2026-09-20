# pyrefly: ignore [missing-import]
from fastapi import UploadFile,File
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from bson import ObjectId

from config import profiles,credentials,users,client
from schemas.Database import ProfileUpdateSchema
from security.auth_service import get_current_user
from cloudinary_config import cloudinary

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

@router.post("/upload_photo")
async def upload_photo(
    file
    : UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG and WebP images are allowed",
        )

    profile = profiles.find_one({
        "user_id": ObjectId(user_id)
    })

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    image_bytes = await file.read()

    try:
        # Upload new image
        upload_result = cloudinary.uploader.upload(
            image_bytes,
            folder="lokol/profile",
            resource_type="image",
        )

        new_url = upload_result["secure_url"]
        new_public_id = upload_result["public_id"]

        # Get old image information
        old_public_id = profile.get("profile_pic_public_id")

        # Update MongoDB
        profiles.update_one(
            {"user_id": ObjectId(user_id)},
            {
                "$set": {
                    "profile_pic": new_url,
                    "profile_pic_public_id": new_public_id,
                }
            }
        )

        # Delete old image from Cloudinary
        if old_public_id:
            cloudinary.uploader.destroy(old_public_id)

        return {
            "message": "Profile picture uploaded successfully",
            "profile_pic": new_url,
            "public_id": new_public_id,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Image upload failed: {str(error)}",
        )
@router.delete("/photo")
def delete_profile_photo(
    user_id: str = Depends(get_current_user)
):
    profile = profiles.find_one({
        "user_id": ObjectId(user_id)
    })

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    public_id = profile.get("profile_pic_public_id")

    # Delete image from Cloudinary
    if public_id:
        cloudinary.uploader.destroy(public_id)

    # Remove image information from MongoDB
    profiles.update_one(
        {"user_id": ObjectId(user_id)},
        {
            "$unset": {
                "profile_pic": "",
                "profile_pic_public_id": "",
            }
        }
    )

    return {
        "message": "Profile picture deleted successfully"
    }