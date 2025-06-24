from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from backend.db.session import SessionLocal
from backend.db.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String(50), unique=True, nullable=False) 
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)