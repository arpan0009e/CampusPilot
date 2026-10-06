from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import HTTPException, status
from jose import jwt

from backend.app.config import settings
from backend.app.database.connection import get_database
from backend.app.models.user import User


# Hash a password
def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()

    hashed_password = bcrypt.hashpw(password_bytes, salt)

    return hashed_password.decode("utf-8")


# Verify a password against its stored hash
def verify_password(password: str, hashed_password: str) -> bool:
    password_bytes = password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(password_bytes, hashed_bytes)


# Create a JWT access token
def create_access_token(user_id: str) -> str:
    expire_time = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": user_id,
        "exp": expire_time,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


# Decode and validate a JWT access token
def decode_access_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


# Find a user by email
async def get_user_by_email(email: str):
    database = get_database()
    user_data = await database["users"].find_one({"email": email})

    if user_data is None:
        return None

    user_data["_id"] = str(user_data["_id"])

    return User.model_validate(user_data)


# Register a new user
async def register_user(user_data):
    database = get_database()
    users_collection = database["users"]

    existing_user = await users_collection.find_one(
        {"email": user_data.email}
    )

    if existing_user:
        raise ValueError("Email is already registered")

    hashed_password = hash_password(user_data.password)

    user = User(
        name=user_data.name,
        email=user_data.email,
        department=user_data.department,
        semester=user_data.semester,
        enrollment_id=user_data.enrollment_id,
        hashed_password=hashed_password,
        is_active=True,
    )

    result = await users_collection.insert_one(
        user.model_dump(by_alias=True, exclude_none=True)
    )

    user.id = str(result.inserted_id)

    return user


# Authenticate an existing user
async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)

    if user is None:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user