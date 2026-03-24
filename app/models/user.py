"Модеь для user"
from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import String
from app.core.database import Base, IntPk, StrUniq, StrNullTrue

if TYPE_CHECKING:
    from app.models.user_movie import UserMovie

class User(Base):
    """
    Модель для User
    """
    __tablename__ = "users"

    id: Mapped[IntPk]
    username: Mapped[StrUniq]
    email: Mapped[StrUniq]
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    avatar: Mapped[StrNullTrue]

    ratings: Mapped[list[UserMovie]] = relationship(
        "UserMovie",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __str__(self):
        return (f"User(id={self.id}, username={self.username!r})")

    def __repr__(self):
        return str(self)
