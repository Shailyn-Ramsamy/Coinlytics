from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from services.auth_service import get_or_create_google_user, get_current_user
from db import get_db
from starlette import status
from models.user import User
from schemas.user import GoogleUserInfo, UserRead
from datetime import datetime, timedelta
from google.auth.transport import requests
from google.oauth2 import id_token
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from jose import jwt


load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

class TokenRequest(BaseModel):
    token: str

db_dependancy = Annotated[Session, Depends(get_db)]


def create_jwt_token(data: dict, expires_minutes=60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))

@router.post("/google")
def login_google(token_req: TokenRequest, db: db_dependancy):
    try:
        idinfo = id_token.verify_oauth2_token(
            token_req.token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        google_id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo.get("name")
        picture = idinfo.get("picture")

        user = get_or_create_google_user(db, google_id, email)

        token_data = {
            "sub": str(user.id),
            "name": name,
            "picture": picture
        }
        jwt_token = create_jwt_token(token_data)

        response = JSONResponse(content={"message": "Login successful"})
        response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True,
            secure=False,
            samesite=None,
            max_age=60 * 60
        )
        return response

    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")
    
@router.get("/me")
def get_current_user_info(
    token_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == token_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at,
        "name": token_user.get("name"),
        "picture": token_user.get("picture"),
    }