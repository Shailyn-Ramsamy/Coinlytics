from fastapi import APIRouter, Depends, HTTPException, Query
import os
import requests
from typing import Optional
from starlette import status
from dotenv import load_dotenv

from services.auth_service import get_current_user
load_dotenv()

router = APIRouter()

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/stocks")
def get_stock_news(
    category: Optional[str] = Query("general", description="News category: general, forex, crypto, or merger"),
    user_id: int = Depends(get_current_user)
):
    token = os.getenv("FINNHUB_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="API key not configured.")

    url = f"https://finnhub.io/api/v1/news"
    params = {
        "category": category,
        "token": token
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Stock news fetch failed: {str(e)}")

    return response.json()
