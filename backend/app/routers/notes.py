from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.models.user import User
from backend.app.schemas.note import (
    NoteCreate,
    NoteResponse,
    NoteUpdate,
)
from backend.app.services.auth_dependency import get_current_user
from backend.app.services.note_service import (
    create_note,
    delete_note,
    get_note,
    get_user_notes,
    update_note,
)


router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)


@router.post(
    "",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_note(
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user),
):
    note = await create_note(
        note_data,
        current_user.id,
    )

    return NoteResponse(
        id=note.id,
        user_id=note.user_id,
        topic=note.topic,
        title=note.title,
        content=note.content,
    )


@router.get(
    "",
    response_model=list[NoteResponse],
)
async def get_notes(
    current_user: User = Depends(get_current_user),
):
    notes = await get_user_notes(current_user.id)

    return [
        NoteResponse(
            id=note.id,
            user_id=note.user_id,
            topic=note.topic,
            title=note.title,
            content=note.content,
        )
        for note in notes
    ]


@router.get(
    "/{note_id}",
    response_model=NoteResponse,
)
async def get_single_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    note = await get_note(
        note_id,
        current_user.id,
    )

    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    return NoteResponse(
        id=note.id,
        user_id=note.user_id,
        topic=note.topic,
        title=note.title,
        content=note.content,
    )


@router.put(
    "/{note_id}",
    response_model=NoteResponse,
)
async def update_existing_note(
    note_id: str,
    note_data: NoteUpdate,
    current_user: User = Depends(get_current_user),
):
    note = await update_note(
        note_id,
        current_user.id,
        note_data,
    )

    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    return NoteResponse(
        id=note.id,
        user_id=note.user_id,
        topic=note.topic,
        title=note.title,
        content=note.content,
    )


@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_existing_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
):
    deleted = await delete_note(
        note_id,
        current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )