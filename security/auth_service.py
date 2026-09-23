
from datetime import datetime, timedelta
from jose import jwt
import os
from datetime import timezone
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends, HTTPException

from fastapi import WebSocket, WebSocketException, status
oauth2_scheme = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

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
    


async def get_current_user_ws(websocket: WebSocket):
    token = websocket.query_params.get("token")

    if not token:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Missing token"
        )

    try:
        payload = decode_token(token)
    except jwt.JWTError:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Invalid token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Invalid token"
        )

    return user_id