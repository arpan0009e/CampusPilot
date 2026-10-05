from pydantic import BaseModel, EmailStr, Field
# from datetime import datetime
from typing import Optional


class User(BaseModel):
    """
    User model for CampusPilot.
    """

    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    department: str
    semester : Optional[str] = None
    enrollment_id : Optional[int] = None
    hashed_password: str
    is_active: bool = True

    class Config:
        populate_by_name = True
        from_attributes = True