from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from services.stock_service import get_portfolio_distribution, search_stocks
from db import get_db
from schemas.purchase import StockRead

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("/search", response_model=List[StockRead])
def search_stock_endpoint(
    query: str = Query("", description="Search term for name or symbol"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    return search_stocks(db=db, query=query, page=page, page_size=page_size)

@router.get("/distribution")
def user_stock_distribution(user_id: int, db: Session = Depends(get_db)):
    return get_portfolio_distribution(user_id=user_id, db=db)