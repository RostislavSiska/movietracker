"Модель для movie"
from __future__ import annotations
from typing import TYPE_CHECKING, Optional, List
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import Integer, String, Float, Text, ARRAY
from app.core.database import Base, IntPk

if TYPE_CHECKING:
    from app.models.user_movie import UserMovie

class Movie(Base):
    """
    Модель для Movie
    """
    __tablename__ = "movies"

    id: Mapped[IntPk]
    tmdb_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    poster_path: Mapped[Optional[str]]
    overview: Mapped[Optional[str]] = mapped_column(Text)
    release_date: Mapped[Optional[str]]
    vote_average: Mapped[Optional[float]] = mapped_column(Float)
    runtime: Mapped[Optional[int]]
    production_countries: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))

    ratings: Mapped[list[UserMovie]] = relationship(
        "UserMovie",
        back_populates="movie",
        cascade="all, delete-orphan"
    )

    def __str__(self):
        return (f"Movie(id={self.id}, title={self.title!r})")

    def __repr__(self):
        return str(self)
