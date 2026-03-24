from fastapi import FastAPI
from fastapi import FastAPI
from app.routers import auth, movies
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Movie Tracker")



app.include_router(auth.router)
app.include_router(movies.router)


origins = "http://127.0.0.1:5000"

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)