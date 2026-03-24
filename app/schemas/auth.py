"Схемы для авторизации"
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    "Схема создания пользователя"
    username: str = Field(..., min_length=3, max_length=50, description="Имя от 3 до 50 символов")
    email: EmailStr
    password: str = Field(..., min_length=6, description="Пароль минимум 6 символов")

class UserOut(BaseModel):
    "Схема для вывода информации пользователя"
    id: int
    username: str
    email: EmailStr
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        "Конфиг"
        from_attributes = True

class Token(BaseModel):
    "Схема токена"
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    "Инфа о токене"
    username: Optional[str] = None

class LoginForm(BaseModel):
    "Форма логина"
    username: str
    password: str
