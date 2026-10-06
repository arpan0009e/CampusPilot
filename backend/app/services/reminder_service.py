from bson import ObjectId

from backend.app.database.connection import get_database
from backend.app.models.reminder import Reminder


async def create_reminder(reminder_data, user_id: str):
    database = get_database()
    reminders_collection = database["reminders"]

    reminder = Reminder(
        user_id=user_id,
        title=reminder_data.title,
        description=reminder_data.description,
        reminder_time=reminder_data.reminder_time,
        is_completed=False,
    )

    result = await reminders_collection.insert_one(
        reminder.model_dump(
            by_alias=True,
            exclude_none=True,
        )
    )

    reminder.id = str(result.inserted_id)

    return reminder


async def get_user_reminders(user_id: str):
    database = get_database()
    reminders_collection = database["reminders"]

    cursor = reminders_collection.find(
        {"user_id": user_id}
    ).sort("reminder_time", 1)

    reminders = []

    async for reminder_data in cursor:
        reminder_data["_id"] = str(reminder_data["_id"])
        reminders.append(Reminder.model_validate(reminder_data))

    return reminders


async def get_reminder(reminder_id: str, user_id: str):
    if not ObjectId.is_valid(reminder_id):
        return None

    database = get_database()
    reminders_collection = database["reminders"]

    reminder_data = await reminders_collection.find_one(
        {
            "_id": ObjectId(reminder_id),
            "user_id": user_id,
        }
    )

    if reminder_data is None:
        return None

    reminder_data["_id"] = str(reminder_data["_id"])

    return Reminder.model_validate(reminder_data)


async def update_reminder(
    reminder_id: str,
    user_id: str,
    reminder_data,
):
    if not ObjectId.is_valid(reminder_id):
        return None

    database = get_database()
    reminders_collection = database["reminders"]

    update_data = reminder_data.model_dump(
        exclude_unset=True
    )

    if not update_data:
        return await get_reminder(
            reminder_id,
            user_id,
        )

    result = await reminders_collection.update_one(
        {
            "_id": ObjectId(reminder_id),
            "user_id": user_id,
        },
        {
            "$set": update_data,
        },
    )

    if result.matched_count == 0:
        return None

    return await get_reminder(
        reminder_id,
        user_id,
    )


async def delete_reminder(
    reminder_id: str,
    user_id: str,
):
    if not ObjectId.is_valid(reminder_id):
        return False

    database = get_database()
    reminders_collection = database["reminders"]

    result = await reminders_collection.delete_one(
        {
            "_id": ObjectId(reminder_id),
            "user_id": user_id,
        }
    )

    return result.deleted_count > 0