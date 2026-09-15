# pyrefly: ignore [missing-import]
from pydantic import BaseModel,EmailStr
# pyrefly: ignore [missing-import]
from pydantic_extra_types.phone_numbers import PhoneNumber, PhoneNumberValidator
from typing import Annotated,Optional

E164Phone = Annotated[PhoneNumber, PhoneNumberValidator(number_format="E164")]


class signUpSchema(BaseModel):
    email:EmailStr
    phoneNo:E164Phone
    username:str
    password:str

class loginSchema(BaseModel):
    email:Optional[EmailStr] = None
    phoneNo:Optional[E164Phone] = None
    password:str
class tokenSchema(BaseModel):
    access_token: str
    refresh_token:Optional[str] = None
    token_type: str = "bearer"