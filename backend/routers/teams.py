from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from models.team import Team
from database import get_session

router = APIRouter(prefix="/team", tags=["Team"])

@router.get("", response_model=list[Team])
def get_all_teams(session: Session = Depends(get_session)):
    """Returns all teams in the database."""
    teams = session.exec(select(Team)).all()
    return teams
