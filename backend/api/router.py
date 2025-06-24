from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Annotated
from backend.api.routes import auth
from backend.api.routes import news
from backend.api.routes import purchase
from backend.api.routes import stocks


router = APIRouter()
router.include_router(auth.router)
router.include_router(news.router)
router.include_router(purchase.router)
router.include_router(stocks.router)