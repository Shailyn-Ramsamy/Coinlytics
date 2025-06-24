from sqlalchemy import Column, Integer, String
from backend.db.base import Base
from sqlalchemy.orm import relationship

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), unique=True, nullable=False)   # e.g., AAPL
    name = Column(String(100), nullable=False)                 # e.g., Apple Inc.
    exchange = Column(String(50))                              # e.g., NASDAQ
    currency = Column(String(10), default="USD")               # e.g., USD, EUR