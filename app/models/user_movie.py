"Модель для usermovie"
from __future__ import annotations
from enum import Enum
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey, Text
from app.core.database import Base, IntPk

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.movie import Movie

class MovieStatus(Enum):
    """
    Статусы просмотренности фильмов
    """
    WATCHED = "watched"
    PLANNED = "planned"
    DROPPED = "dropped"

class UserMovie(Base):
    """
    Модель для UserMovie
    """
    __tablename__ = "user_movies"

    id: Mapped[IntPk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id", ondelete="CASCADE"))
    status: Mapped[MovieStatus] = mapped_column(SQLAlchemyEnum(MovieStatus), nullable=False)
    rating: Mapped[Optional[int]]
    review: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


    user: Mapped[User] = relationship("User", back_populates="ratings")
    movie: Mapped[Movie] = relationship("Movie", back_populates="ratings")

    def __str__(self):
        return (f"UserMovie(user_id={self.user_id}, \
                movie_id={self.movie_id}, status={self.status})")

    def __repr__(self):
        return str(self)
