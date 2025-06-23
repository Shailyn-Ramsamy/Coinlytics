# api/stocks.py (or create a new api/portfolio.py if preferred)

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from services.auth_service import get_current_user
from db import get_db
from services.portfolio_service import get_portfolio_value_history

router = APIRouter()

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.get("/history")
def portfolio_value_over_time(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_portfolio_value_history(user_id=user_id, db=db)
