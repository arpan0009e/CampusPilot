from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Note(BaseModel):
    """
    Note model for CampusPilot.
    """

    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        from_attributes = True