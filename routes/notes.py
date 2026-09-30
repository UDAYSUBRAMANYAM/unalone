# pyrefly: ignore [missing-import]

from security.auth_service import get_current_user_ws
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from config import notes
from security.auth_service import get_current_user_ws
from schemas.notes import UserNote

def write_note(note:UserNote,user_id = Depends(get_current_user_ws)):
    if user_id == (note.user_id):
        notes.update_one(note)
    else:
        pass
    return user_id