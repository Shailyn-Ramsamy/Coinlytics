from sqlalchemy import Column, Integer, ForeignKey, Date, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.db.base import Base
from .stocks import Stock

class StockPrice(Base):
    __tablename__ = "stock_prices"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    close_price = Column(Numeric(20, 2), nullable=False)

    stock = relationship(Stock, backref="prices")

    __table_args__ = (
        UniqueConstraint("stock_id", "date", name="uix_stock_date"),
    )
