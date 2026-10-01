
from datetime import datetime, timedelta
from jose import jwt
import os
from datetime import timezone
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends, HTTPException
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from jose import JWTError, jwt

from fastapi import WebSocket, WebSocketException, status
oauth2_scheme = HTTPBearer()
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 
REFRESH_TOKEN_EXPIRE_DAYS = 7          

def create_access_token(subject:str) :
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub":subject,
        "exp": expire,
        "type": "access"
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token:str):
    return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
def get_current_user(token:HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    try:
        payload = decode_token(token.credentials)
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code = 401,detail='invalid token')
    return user_id 

def create_refresh_token(subject:str):
    expire = datetime.now(timezone.utc) + timedelta(days = REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "sub":subject,
        "exp": expire,
        "type": "refresh"
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    

async def get_current_user_ws(
    websocket: WebSocket,
) -> str:

    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        raise Exception("Missing WebSocket token")

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if not user_id:
            await websocket.close(code=1008)
            raise Exception("Invalid token")

        return str(user_id)

    except JWTError:
        await websocket.close(code=1008)
        raise Exception("Invalid or expired token")