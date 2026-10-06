from bson import ObjectId

from backend.app.database.connection import get_database
from backend.app.models.task import Task


async def create_task(task_data, user_id: str):
    database = get_database()
    tasks_collection = database["tasks"]

    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
    )

    result = await tasks_collection.insert_one(
        task.model_dump(by_alias=True, exclude_none=True)
    )

    task.id = str(result.inserted_id)

    return task


async def get_user_tasks(user_id: str):
    database = get_database()
    tasks_collection = database["tasks"]

    cursor = tasks_collection.find({"user_id": user_id})

    tasks = []

    async for task_data in cursor:
        task_data["_id"] = str(task_data["_id"])
        tasks.append(Task.model_validate(task_data))

    return tasks


async def get_task(task_id: str, user_id: str):
    if not ObjectId.is_valid(task_id):
        return None

    database = get_database()
    tasks_collection = database["tasks"]

    task_data = await tasks_collection.find_one(
        {
            "_id": ObjectId(task_id),
            "user_id": user_id,
        }
    )

    if task_data is None:
        return None

    task_data["_id"] = str(task_data["_id"])

    return Task.model_validate(task_data)


async def update_task(task_id: str, user_id: str, task_data):
    if not ObjectId.is_valid(task_id):
        return None

    database = get_database()
    tasks_collection = database["tasks"]

    update_data = task_data.model_dump(exclude_unset=True)

    if not update_data:
        return await get_task(task_id, user_id)

    result = await tasks_collection.update_one(
        {
            "_id": ObjectId(task_id),
            "user_id": user_id,
        },
        {
            "$set": update_data,
        },
    )

    if result.matched_count == 0:
        return None

    return await get_task(task_id, user_id)


async def delete_task(task_id: str, user_id: str):
    if not ObjectId.is_valid(task_id):
        return False

    database = get_database()
    tasks_collection = database["tasks"]

    result = await tasks_collection.delete_one(
        {
            "_id": ObjectId(task_id),
            "user_id": user_id,
        }
    )

    return result.deleted_count > 0