# pyrefly: ignore [missing-import]
from datetime import timezone,datetime
# pyrefly: ignore [missing-import]
from fastapi import APIRouter,HTTPException
from schemas.auth import loginSchema,signUpSchema
from schemas.Database import usersDBschema,credentialDBschema,profileDBschema
from security.security import hash_password,verify_password
from config import users,credentials,profiles
# pyrefly: ignore [missing-import]
from bson import ObjectId


router = APIRouter(prefix="/auth", tags=["Auth"])
from security.auth_service import create_access_token

@router.post("/signup")
def signup(data:signUpSchema):
    if credentials.find_one({"email":data.email}):
        raise HTTPException(status_code=400,detail="Email already exists")
    if credentials.find_one({"phoneNo":data.phoneNo}):
        raise HTTPException(status_code=400,detail="Phone Number already exists")
    curr_id = ObjectId()
    hash_pass = hash_password(data.password)
    user = usersDBschema(_id=curr_id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        last_active_at=datetime.now(timezone.utc),
        profile_verified=False,
        email_verified=False,
        phone_verified=False)

    credential = credentialDBschema(
        _id = ObjectId(),
        user_id = curr_id,
        email = data.email,
        phoneNo = data.phoneNo,
        password = hash_pass,
        )
    profile = profileDBschema(
        _id = ObjectId(),
        user_id = curr_id,
        username = data.username,
    )
    try:
        users.insert_one(user.model_dump()) 
        credentials.insert_one(credential.model_dump()) 
        profiles.insert_one(profile.model_dump())
        access_token = create_access_token(str(curr_id))
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup Failed {e}")

# @router.post("/login")
# def login(data:loginSchema):
#     if credentials.find_one(data.email) or credentials.find_one(data.phoneNo):
        
