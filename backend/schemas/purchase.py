from pydantic import BaseModel
from datetime import date, datetime

class PurchaseCreate(BaseModel):
    stock_id: int
    amount_spent: float
    purchase_date: date

class PurchaseRead(PurchaseCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class StockRead(BaseModel):
    id: int
    symbol: str
    name: str

    class Config:
        orm_mode = True
