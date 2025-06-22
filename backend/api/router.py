from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Annotated
from api.routes import users
from api.routes import auth
from api.routes import news
from api.routes import purchase
from api.routes import portfolio
from api.routes import stocks


router = APIRouter()
router.include_router(users.router)
router.include_router(auth.router)
router.include_router(news.router)
router.include_router(purchase.router)
router.include_router(portfolio.router)
router.include_router(stocks.router)