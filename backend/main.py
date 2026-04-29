#initializes fastapi and registers main router

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import players_info, predict, team_info, search


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
main_router = APIRouter(prefix="/api")
main_router.include_router(players_info.router)
main_router.include_router(predict.router)
main_router.include_router(team_info.router)
main_router.include_router(search.router)

app.include_router(main_router)
app.include_router(players_info.router)
app.include_router(predict.router)
app.include_router(team_info.router)
app.include_router(search.router)

@app.get("/")
def root():
    return {"message": "Backend is running"}