import os
from app.routers import auth, movies
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Путь к статике (абсолютный)
STATIC_DIR = "app/static"


app = FastAPI(title="Movie Tracker")

# Подключаем API роутеры (должны быть до catch-all)

app.include_router(auth.router, prefix="/api")
app.include_router(movies.router, prefix="/api")

# Монтируем папку static – все файлы из неё будут доступны по /static/*
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Catch-all для SPA: отдаёт index.html для всех маршрутов, кроме /api и /static
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Если путь начинается с api/ или static/ – не обрабатываем (они уже обработаны выше)
    if full_path.startswith("api/") or full_path.startswith("static/"):
        raise HTTPException(status_code=404)

    # Иначе отдаём index.html
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path)

# Обрабатываем корневой маршрут отдельно (хотя catch-all тоже сработает, но так надёжнее)
@app.get("/")
async def root():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))