"Роутеры для фильмов"
from typing import List
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.tmdb import TMDbService
from app.schemas.movie import MovieOut, MovieSearchResponse

router = APIRouter(prefix="/movies", tags=["movies"])

tmdb_service = TMDbService()

@router.get("/search", response_model=MovieSearchResponse)
async def search_movies(
    query: str = Query(..., min_length=1, description="Название фильма"),
    page: int = Query(1, ge=1, description="Номер страницы")
):
    """
    Поиск фильмов по названию через TMDB.
    """
    try:
        results = await tmdb_service.search_movies(query, page)
        # Преобразуем в формат, ожидаемый клиентом
        movies = []
        for item in results:
            movies.append(MovieOut(
                id=item.get("id"),
                tmdb_id=item.get("id"),
                title=item.get("title"),
                poster_path=item.get("poster_path"),
                poster_url=tmdb_service.get_poster_url(item.get("poster_path")),
                overview=item.get("overview"),
                release_date=item.get("release_date"),
                vote_average=item.get("vote_average")
            ))
        return {
            "results": movies,
            "page": page,
            "total_pages": results.get("total_pages", 1) if isinstance(results, dict) else 1
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"TMDB API error: {str(e)}")

@router.get("/popular", response_model=List[MovieOut])
async def get_popular_movies(
    page: int = Query(1, ge=1, description="Номер страницы")
):
    """
    Список популярных фильмов.
    """
    try:
        results = await tmdb_service.get_popular_movies(page)
        movies = []
        for item in results:
            movies.append(MovieOut(
                id=item.get("id"),
                tmdb_id=item.get("id"),
                title=item.get("title"),
                poster_path=item.get("poster_path"),
                poster_url=tmdb_service.get_poster_url(item.get("poster_path")),
                overview=item.get("overview"),
                release_date=item.get("release_date"),
                vote_average=item.get("vote_average")
            ))
        return movies
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"TMDB API error: {str(e)}")

@router.get("/{movie_id}", response_model=MovieOut)
async def get_movie_by_id(movie_id: int):
    """
    Получение детальной информации о фильме по его TMDB ID.
    """
    try:
        movie = await tmdb_service.get_movie_details(movie_id)
        return MovieOut(
            id=movie.get("id"),
            tmdb_id=movie.get("id"),
            title=movie.get("title"),
            poster_path=movie.get("poster_path"),
            poster_url=tmdb_service.get_poster_url(movie.get("poster_path")),
            overview=movie.get("overview"),
            release_date=movie.get("release_date"),
            vote_average=movie.get("vote_average"),
            runtime=movie.get("runtime"),
            production_countries=[c["iso_3166_1"] for c in movie.get("production_countries", [])]
        )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Фильм не найден")
        raise HTTPException(status_code=503, detail=f"TMDB API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service error: {str(e)}")
