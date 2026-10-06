from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Reminder(BaseModel):
    """
    Reminder model for CampusPilot.
    """

    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    title: str
    description: Optional[str] = None
    reminder_time: datetime
    is_completed: bool = False
    # created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        from_attributes = True