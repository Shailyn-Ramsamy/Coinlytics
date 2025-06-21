import re
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserRead
from passlib.context import CryptContext

def get_user_by_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user