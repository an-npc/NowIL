#initializes fastapi and registers main router

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< Updated upstream
from routers import test,players,teams
=======
from routers import players_info, predict, team_info
>>>>>>> Stashed changes


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< Updated upstream
app.include_router(test.router)
app.include_router(players.router)
=======
app.include_router(players_info.router)
app.include_router(predict.router)
app.include_router(team_info.router)
>>>>>>> Stashed changes

@app.get("/")
def root():
    return {"message": "Backend is running"}
