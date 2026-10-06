from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: str
    semester: str | None = None
    enrollment_id: int | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    department: str
    semester: str | None = None
    enrollment_id: int | None = None
    is_active: bool