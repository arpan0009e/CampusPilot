from bson import ObjectId

from backend.app.database.connection import get_database
from backend.app.models.note import Note


async def create_note(note_data, user_id: str):
    database = get_database()
    notes_collection = database["notes"]

    note = Note(
        user_id=user_id,
        topic=note_data.topic,
        title=note_data.title,
        content=note_data.content,
    )

    result = await notes_collection.insert_one(
        note.model_dump(
            by_alias=True,
            exclude_none=True,
        )
    )

    note.id = str(result.inserted_id)

    return note


async def get_user_notes(user_id: str):
    database = get_database()
    notes_collection = database["notes"]

    cursor = notes_collection.find(
        {"user_id": user_id}
    )

    notes = []

    async for note_data in cursor:
        note_data["_id"] = str(note_data["_id"])
        notes.append(Note.model_validate(note_data))

    return notes


async def get_note(note_id: str, user_id: str):
    if not ObjectId.is_valid(note_id):
        return None

    database = get_database()
    notes_collection = database["notes"]

    note_data = await notes_collection.find_one(
        {
            "_id": ObjectId(note_id),
            "user_id": user_id,
        }
    )

    if note_data is None:
        return None

    note_data["_id"] = str(note_data["_id"])

    return Note.model_validate(note_data)


async def update_note(note_id: str, user_id: str, note_data):
    if not ObjectId.is_valid(note_id):
        return None

    database = get_database()
    notes_collection = database["notes"]

    update_data = note_data.model_dump(
        exclude_unset=True
    )

    if not update_data:
        return await get_note(note_id, user_id)

    result = await notes_collection.update_one(
        {
            "_id": ObjectId(note_id),
            "user_id": user_id,
        },
        {
            "$set": update_data,
        },
    )

    if result.matched_count == 0:
        return None

    return await get_note(note_id, user_id)


async def delete_note(note_id: str, user_id: str):
    if not ObjectId.is_valid(note_id):
        return False

    database = get_database()
    notes_collection = database["notes"]

    result = await notes_collection.delete_one(
        {
            "_id": ObjectId(note_id),
            "user_id": user_id,
        }
    )

    return result.deleted_count > 0