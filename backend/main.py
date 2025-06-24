from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from backend.api.router import router
from fastapi.responses import FileResponse

app = FastAPI()

# origins = [
#     "http://localhost:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



app.include_router(router, prefix="/api")


app.mount("/static", StaticFiles(directory="backend/frontend/build/static"), name="static")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    if full_path.startswith("api/"):
        return {"error": "API route not found"}
    
    return FileResponse("backend/frontend/build/index.html")