from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Annotated
from api.routes import users
from api.routes import auth
from api.routes import news

router = APIRouter()
router.include_router(users.router)
router.include_router(auth.router)
router.include_router(news.router)