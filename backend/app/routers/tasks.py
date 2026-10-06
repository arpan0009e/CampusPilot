from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.models.user import User
from backend.app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from backend.app.services.auth_dependency import get_current_user
from backend.app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    get_user_tasks,
    update_task,
)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
):
    task = await create_task(
        task_data,
        current_user.id,
    )

    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
    )


@router.get(
    "",
    response_model=list[TaskResponse],
)
async def get_tasks(
    current_user: User = Depends(get_current_user),
):
    tasks = await get_user_tasks(current_user.id)

    return [
        TaskResponse(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date,
        )
        for task in tasks
    ]


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
)
async def get_single_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
):
    task = await get_task(
        task_id,
        current_user.id,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
    )


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
)
async def update_existing_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
):
    task = await update_task(
        task_id,
        current_user.id,
        task_data,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
    )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
):
    deleted = await delete_task(
        task_id,
        current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )