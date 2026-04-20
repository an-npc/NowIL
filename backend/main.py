#initializes fastapi and registers main router

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import players_info


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players_info.router)

@app.get("/")
def root():
    return {"message": "Backend is running"}