from datetime import datetime

from pydantic import BaseModel


class ReminderCreate(BaseModel):
    title: str
    description: str | None = None
    reminder_time: datetime


class ReminderUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    reminder_time: datetime | None = None
    is_completed: bool | None = None


class ReminderResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str | None = None
    reminder_time: datetime
    is_completed: bool