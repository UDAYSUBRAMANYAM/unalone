from typing import Optional

from pydantic import BaseModel


class UserNote(BaseModel):
    note: Optional[str] = None