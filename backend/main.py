#initializes fastapi and registers main router

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import test,players,teams


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test.router)
app.include_router(players.router)

@app.get("/")
def root():
    return {"message": "Backend is running"}
