
from security.auth_service import get_current_user
from security.auth_service import get_current_user_ws
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from config import notes
from security.auth_service import get_current_user_ws
from schemas.notes import UserNote
 
router = APIRouter(prefix="/notes", tags=["Notes"])

@router.post("/me")
def write_note(note:UserNote,user_id = Depends(get_current_user)):
    existing_note = notes.find_one({"user_id": user_id})
    if existing_note:
        raise HTTPException(status_code=409, detail="Note already exists")
    result = notes.insert_one({"user_id":user_id,"note":note.note})
    return {"message":"Note added successfully", "note":note.note}
@router.get("/my_note")
def get_my_note(user_id = Depends(get_current_user)):
    existing_note = notes.find_one({"user_id": user_id})
    if not existing_note:
        raise HTTPException(status_code=404, detail="No Note Found")
    return {"note" : existing_note["note"]}

@router.put("/me")
def update_note(note:UserNote,user_id=Depends(get_current_user)):
    result = notes.update_one({"user_id":user_id},{"$set":{"note":note.note}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="No Note Found")
    return {"message":"Note updated successfully", "note":note.note}
@router.get("/delete")
def delete_my_note(user_id = Depends(get_current_user)):
    result = notes.delete_one({"user_id":user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No Note Found")
    return {"message":"Note deleted successfully"}