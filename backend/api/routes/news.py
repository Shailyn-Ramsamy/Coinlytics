from fastapi import APIRouter, HTTPException
import os
import requests

router = APIRouter()

@router.get("/news")
def get_crypto_news():
    token = os.getenv("CRYPTOPANIC_API_KEY")
    if not token:
        raise HTTPException(status_code=500, detail="API key not configured.")

    url = f"https://cryptopanic.com/api/v1/posts/?auth_token={token}&filter=rising"
    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch news")

    return response.json()
