from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserLogin, UserResponse
from backend.app.services.auth_dependency import get_current_user
from backend.app.services.auth_service import (
    authenticate_user,
    create_access_token,
    register_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(user_data: UserCreate):
    try:
        user = await register_user(user_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        department=user.department,
        semester=user.semester,
        enrollment_id=user.enrollment_id,
        is_active=user.is_active,
    )


@router.post("/login")
async def login(user_data: UserLogin):
    user = await authenticate_user(
        user_data.email,
        user_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        department=current_user.department,
        semester=current_user.semester,
        enrollment_id=current_user.enrollment_id,
        is_active=current_user.is_active,
    )