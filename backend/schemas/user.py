from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRead(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    name: str | None = None
    picture: str | None = None

    class Config:
        orm_mode = True


class GoogleUserInfo(BaseModel):
    email: EmailStr
    name: str | None = None
    picture: str | None = None
    sub: str