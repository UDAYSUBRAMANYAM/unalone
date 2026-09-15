# pyrefly: ignore [missing-import]
from datetime import datetime
# pyrefly: ignore [missing-import]
from pydantic import BaseModel,EmailStr,Field,HttpUrl,ConfigDict
# pyrefly: ignore [missing-import]
from pydantic_extra_types.phone_numbers import PhoneNumber, PhoneNumberValidator
from typing import Annotated,Optional,List
# pyrefly: ignore [missing-import]
from bson.objectid import ObjectId
from enum import Enum

E164Phone = Annotated[PhoneNumber, PhoneNumberValidator(number_format="E164")]

class Gender(str, Enum):
  male = 'male'
  female = 'female'
  other = 'other'
  not_given = 'not_given'

class usersDBschema(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    _id: ObjectId
    status:Optional[str] = None
    created_at : datetime
    updated_at : datetime
    last_active_at : Optional[datetime] =None
    phone_verified : bool = Field( default=False)
    email_verified : bool = Field( default=False)
    profile_verified : bool = Field( default=False)

class credentialDBschema(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    _id: ObjectId
    user_id : ObjectId 
    email : Optional[EmailStr] = None
    password: str
    phoneNo : Optional[E164Phone] = None

class profileDBschema(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    _id : ObjectId
    user_id : ObjectId
    username : Optional[str] = None 
    address : Optional[str] = None
    dob :  Optional[datetime] = None
    gender : Optional[Gender] = None
    gender_of_intrest : list = Field(default_factory=list)
    about : str | None = None
    profile_pic : HttpUrl |None = None
    hometown : Optional[str] = None
    ethinicity : Optional[str] = None
    gender_orientation : list = Field(default_factory=list)

class ProfileUpdateSchema(BaseModel):
    username: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[datetime] = None
    gender: Optional[Gender] = None
    gender_of_intrest: Optional[list] = None
    about: Optional[str] = None
    profile_pic: Optional[HttpUrl] = None
    hometown: Optional[str] = None
    ethinicity: Optional[str] = None
    gender_orientation: Optional[list] = None
