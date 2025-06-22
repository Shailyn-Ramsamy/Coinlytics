from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from schemas.purchase import PurchaseCreate, PurchaseRead, StockRead
from services.purchase_service import create_purchase, get_stock_growth, get_user_unique_stocks
from fastapi import status

router = APIRouter()
router = APIRouter(prefix="/stock", tags=["stock"])

@router.post("/purchases", response_model=PurchaseRead, status_code=status.HTTP_201_CREATED)
def add_user_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db),
    user_id: int = 1
):
    return create_purchase(db, user_id=user_id, purchase=purchase)

@router.get("/user-stocks", response_model=list[StockRead])  # assuming you have a StockRead schema
def get_user_stocks(
    db: Session = Depends(get_db),
    user_id: int = 1,
):
    return get_user_unique_stocks(db, user_id)



@router.get("/growth", status_code=status.HTTP_200_OK)
def get_user_stock_growth(
    stock_id: int,
    db: Session = Depends(get_db),
    user_id: int = 1
):
    """
    Returns a list of daily portfolio value for a specific stock,
    calculated using purchase history and historical closing prices.
    """
    return get_stock_growth(user_id=user_id, stock_id=stock_id, db=db)
