from security.auth_service import decode_token
from security.auth_service import (
    create_access_token,
    create_refresh_token
)
from datetime import timezone,datetime
from fastapi import APIRouter,HTTPException,Depends
from schemas.auth import loginSchema,signUpSchema,tokenSchema
from schemas.Database import usersDBschema,credentialDBschema,profileDBschema
from security.security import hash_password,verify_password
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config import client, users, credentials, profiles
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = HTTPBearer()

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
        with client.start_session() as session:
            with session.start_transaction():
                users.insert_one(user.model_dump(),session=session) 
                credentials.insert_one(credential.model_dump(),session=session) 
                profiles.insert_one(profile.model_dump(),session=session)
        access_token = create_access_token(str(curr_id))
        refresh_token = create_refresh_token(str(curr_id))
        return tokenSchema(access_token=access_token,refresh_token=refresh_token,token_type="bearer")
    except DuplicateKeyError as e:
        raise HTTPException(status_code=400,detail=f"Account already exist {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup Failed {e}")

@router.post("/login")
def login(data:loginSchema):
    if data.email:
        credential = credentials.find_one({"email": data.email})
    else:
        credential = credentials.find_one({"phoneNo": data.phoneNo})
    if not credential:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    if verify_password(data.password, credential["password"]):
        access_token = create_access_token(str(credential["user_id"]))
        refresh_token = create_refresh_token(str(credential["user_id"]))
        return tokenSchema(access_token=access_token,refresh_token=refresh_token,token_type="bearer")
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/refresh/me")
def refresh_me(
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    try:
        payload = decode_token(token.credentials)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    new_access_token = create_access_token(user_id)

    return tokenSchema(
        access_token=new_access_token,
        token_type= "bearer"
    )
