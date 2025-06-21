import re
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserRead
from passlib.context import CryptContext

def get_or_create_google_user(db: Session, google_id: str, email: str) -> User:
    user = db.query(User).filter_by(google_id=google_id).first()
    if user:
        return user

    user = User(google_id=google_id, email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
