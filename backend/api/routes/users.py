from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from schemas.user import UserRead
from services.user_service import get_user_by_id

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Annotated[Session, Depends(get_db)]):
    return get_user_by_id(db, user_id)

