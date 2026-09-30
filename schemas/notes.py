from pydantic import BaseModel

class UserNote(BaseModel):
    UserId: str
    note: str