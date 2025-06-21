from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.auth_service import get_or_create_google_user
from db import get_db
from starlette import status
from models.user import User
from schemas.user import GoogleUserInfo, UserRead
from datetime import timedelta
from google.auth.transport import requests
from google.oauth2 import id_token
from dotenv import load_dotenv
import os
from pydantic import BaseModel

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

class TokenRequest(BaseModel):
    token: str

db_dependancy = Annotated[Session, Depends(get_db)]

@router.post("/google", response_model=UserRead)
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

        return {
            "id": user.id,
            "email": user.email,
            "name": name,
            "picture": picture,
            "created_at": user.created_at
        } 

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")