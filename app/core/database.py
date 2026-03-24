"Анотация, подключение к PostgreSQL, базовый класс"
from datetime import datetime
from typing import Annotated
from sqlalchemy import func
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
import os
from dotenv import load_dotenv

load_dotenv()

sqlalchemy_db_url = os.getenv("SQLALCHEMY_DATABASE_URL")

engine = create_engine(sqlalchemy_db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



IntPk = Annotated[int, mapped_column(primary_key=True)]
StrUniq = Annotated[str, mapped_column(unique=True, nullable=False)]
StrNullTrue = Annotated[str, mapped_column(nullable=True)]
CreatedAt = Annotated[datetime, mapped_column(server_default=func.now())]
UpdatedAt = Annotated[datetime, mapped_column(server_default=func.now(), onupdate=datetime.now)]

class Base(DeclarativeBase):
    """
    Базовый класс
    """
    created_at: Mapped[CreatedAt]
    updated_at: Mapped[UpdatedAt]

def get_db():
    "Функция для получения сессии"
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
