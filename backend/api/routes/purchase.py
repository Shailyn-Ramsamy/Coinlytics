from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.services.auth_service import get_current_user
from backend.db import get_db
from backend.schemas.purchase import PurchaseCreate, PurchaseRead, StockRead
from backend.services.purchase_service import create_purchase, get_stock_growth, get_total_portfolio_growth, get_user_unique_stocks
from fastapi import status

router = APIRouter()
router = APIRouter(prefix="/stock", tags=["stock"])

@router.post("/purchases", response_model=PurchaseRead, status_code=status.HTTP_201_CREATED)
def add_user_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db),
    token_user: dict = Depends(get_current_user)
):
    return create_purchase(db, user_id=token_user["user_id"], purchase=purchase)

@router.get("/user-stocks", response_model=list[StockRead])  # assuming you have a StockRead schema
def get_user_stocks(
    db: Session = Depends(get_db),
    token_user: dict  = Depends(get_current_user)
):
    return get_user_unique_stocks(db, token_user["user_id"])



@router.get("/growth", status_code=status.HTTP_200_OK)
def get_user_stock_growth(
    stock_id: int,
    db: Session = Depends(get_db),
    token_user: dict = Depends(get_current_user)
):
    """
    Returns a list of daily portfolio value for a specific stock,
    calculated using purchase history and historical closing prices.
    """
    return get_stock_growth(token_user["user_id"], stock_id=stock_id, db=db)

@router.get("/growth/total", status_code=status.HTTP_200_OK)
def calculate_total_portfolio_growth(
    db: Session = Depends(get_db),
    token_user: dict = Depends(get_current_user)
):
    return get_total_portfolio_growth(token_user["user_id"], db=db)
