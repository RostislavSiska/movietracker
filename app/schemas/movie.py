"Схемы для фильмов"
from typing import Optional, List
from pydantic import BaseModel

class MovieBase(BaseModel):
    "Базовая схема"
    tmdb_id: Optional[int] = None
    title: str
    poster_path: Optional[str] = None
    overview: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    runtime: Optional[int] = None
    production_countries: Optional[List[str]] = None

class MovieOut(MovieBase):
    "Схема для вывода"
    id: Optional[int] = None
    poster_url: Optional[str] = None

    class Config:
        "Конфиг"
        from_attributes = True

class MovieSearchResponse(BaseModel):
    "Схема для поиска"
    results: List[MovieOut]
    page: int
    total_pages: Optional[int] = None
