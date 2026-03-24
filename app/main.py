from fastapi import FastAPI
from fastapi import FastAPI
from app.routers import auth, movies


app = FastAPI(title="Movie Tracker")



app.include_router(auth.router)
app.include_router(movies.router)