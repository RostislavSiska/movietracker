"TMDB Сервис"
from typing import Optional, Dict, Any, List
import httpx
from app.core.config import settings

class TMDbService:
    """Сервис для работы с TMDB API с использованием Bearer token"""

    def __init__(self):
        self.access_token = settings.TMDB_ACCESS_TOKEN
        self.base_url = settings.TMDB_BASE_URL
        self.image_base_url = settings.TMDB_IMAGE_BASE_URL

    def _get_headers(self) -> Dict[str, str]:
        """Формирует заголовки с Bearer token"""
        headers = {}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers

    async def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Базовый метод для отправки запросов к TMDB"""
        if params is None:
            params = {}

        params["language"] = "ru-RU"

        url = f"{self.base_url}{endpoint}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=params,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()

    async def search_movies(self, query: str, page: int = 1) -> List[Dict]:
        "Поиск кино"
        params = {"query": query, "page": page, "include_adult": False}
        result = await self._make_request("/search/movie", params)
        return result.get("results", [])

    async def get_popular_movies(self, page: int = 1) -> List[Dict]:
        "ПОлучить популярные кино"
        params = {"page": page}
        result = await self._make_request("/movie/popular", params)
        return result.get("results", [])

    async def get_movie_details(self, movie_id: int) -> Dict:
        "Получить детали кино"
        return await self._make_request(f"/movie/{movie_id}")

    def get_poster_url(self, poster_path: str, size: str = "w500") -> Optional[str]:
        "Получить постер кино"
        if not poster_path:
            return None
        return f"{self.image_base_url}/{size}{poster_path}"
