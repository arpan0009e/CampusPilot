from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.models.user import User
from backend.app.schemas.reminder import (
    ReminderCreate,
    ReminderResponse,
    ReminderUpdate,
)
from backend.app.services.auth_dependency import get_current_user
from backend.app.services.reminder_service import (
    create_reminder,
    delete_reminder,
    get_reminder,
    get_user_reminders,
    update_reminder,
)


router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"],
)


@router.post(
    "",
    response_model=ReminderResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_reminder(
    reminder_data: ReminderCreate,
    current_user: User = Depends(get_current_user),
):
    reminder = await create_reminder(
        reminder_data,
        current_user.id,
    )

    return ReminderResponse(
        id=reminder.id,
        user_id=reminder.user_id,
        title=reminder.title,
        description=reminder.description,
        reminder_time=reminder.reminder_time,
        is_completed=reminder.is_completed,
    )


@router.get(
    "",
    response_model=list[ReminderResponse],
)
async def get_reminders(
    current_user: User = Depends(get_current_user),
):
    reminders = await get_user_reminders(current_user.id)

    return [
        ReminderResponse(
            id=reminder.id,
            user_id=reminder.user_id,
            title=reminder.title,
            description=reminder.description,
            reminder_time=reminder.reminder_time,
            is_completed=reminder.is_completed,
        )
        for reminder in reminders
    ]


@router.get(
    "/{reminder_id}",
    response_model=ReminderResponse,
)
async def get_single_reminder(
    reminder_id: str,
    current_user: User = Depends(get_current_user),
):
    reminder = await get_reminder(
        reminder_id,
        current_user.id,
    )

    if reminder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found",
        )

    return ReminderResponse(
        id=reminder.id,
        user_id=reminder.user_id,
        title=reminder.title,
        description=reminder.description,
        reminder_time=reminder.reminder_time,
        is_completed=reminder.is_completed,
    )


@router.put(
    "/{reminder_id}",
    response_model=ReminderResponse,
)
async def update_existing_reminder(
    reminder_id: str,
    reminder_data: ReminderUpdate,
    current_user: User = Depends(get_current_user),
):
    reminder = await update_reminder(
        reminder_id,
        current_user.id,
        reminder_data,
    )

    if reminder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found",
        )

    return ReminderResponse(
        id=reminder.id,
        user_id=reminder.user_id,
        title=reminder.title,
        description=reminder.description,
        reminder_time=reminder.reminder_time,
        is_completed=reminder.is_completed,
    )


@router.delete(
    "/{reminder_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_reminder(
    reminder_id: str,
    current_user: User = Depends(get_current_user),
):
    deleted = await delete_reminder(
        reminder_id,
        current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found",
        )