from fastapi import APIRouter, Depends, HTTPException

from config import notes
from security.auth_service import get_current_user
from schemas.notes import UserNote


router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


@router.post("/me")
def write_note(
    note: UserNote,
    user_id=Depends(get_current_user)
):

    existing_note = notes.find_one({
        "user_id": user_id
    })

    if existing_note:
        raise HTTPException(
            status_code=409,
            detail="Note already exists"
        )

    result = notes.insert_one({
        "user_id": user_id,
        "note": note.note
    })


    return {
        "message": "Note added successfully",
        "user_id": user_id,
        "note": note.note
    }


@router.get("/my_note")
def get_my_note(
    user_id=Depends(get_current_user)
):

    existing_note = notes.find_one({
        "user_id": user_id
    })

    if not existing_note:
        raise HTTPException(
            status_code=404,
            detail="No Note Found"
        )

    return {
        "user_id": existing_note["user_id"],
        "note": existing_note.get("note")
    }


@router.put("/me")
def update_note(
    note: UserNote,
    user_id=Depends(get_current_user)
):

    result = notes.update_one(
        {
            "user_id": user_id
        },
        {
            "$set": {
                "note": note.note
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="No Note Found"
        )

    return {
        "message": "Note updated successfully",
        "user_id": user_id,
        "note": note.note
    }


@router.delete("/me")
def delete_my_note(
    user_id=Depends(get_current_user)
):

    result = notes.update_one(
        {
            "user_id": user_id
        },
        {
            "$set": {
                "note": None
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="No Note Found"
        )

    return {
        "message": "Note cleared successfully",
        "user_id": user_id,
        "note": None
    }
