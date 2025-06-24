import os
import re
from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from backend.models.user import User
from backend.schemas.user import UserRead
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv
load_dotenv()

def get_or_create_google_user(db: Session, google_id: str, email: str) -> User:
    user = db.query(User).filter_by(google_id=google_id).first()
    if user:
        return user

    user = User(google_id=google_id, email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        return {
            "user_id": int(payload.get("sub")),
            "name": payload.get("name"),
            "picture": payload.get("picture")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")