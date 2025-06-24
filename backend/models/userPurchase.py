from sqlalchemy import Column, Integer, ForeignKey, Numeric, Date, TIMESTAMP, func
from sqlalchemy.orm import relationship
from backend.db.base import Base
from .stocks import Stock
from .user import User


class UserPurchase(Base):
    __tablename__ = "user_purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False)

    amount_spent = Column(Numeric(20, 2), nullable=False)
    shares = Column(Numeric(20, 6), nullable=False)
    price_per_share = Column(Numeric(20, 2), nullable=False)
    purchase_date = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    stock = relationship(Stock, backref="purchases")
    user = relationship(User, backref="purchases")
