from typing import List,Sequence,Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col,func, desc 
from database import get_session

from models.predict import SelectorForm, DataForm
from models.database_tables import Player, Performance,Team, Game


router = APIRouter(prefix="/predict", tags=["Predict"])



@router.get("/options")
def get_selection_options(session:Session = Depends(get_session)):
    positions = session.exec(
        select(
            Player.position
        )
        .distinct().order_by(Player.position)
    ).all()
    
    schools = session.exec(
        select(
            Team.school
        )
        .distinct().order_by(Team.school)
    ).all()
    
    conferences = [
        "SEC",
    ]
    
    college_years = [
        "Freshman",
        "Sophomore",
        "Junior",
        "Senior"
    ]
    
    years = {
        "2025"
    }
    
    return{
        "conferences": conferences,
        "schools": schools,
        "positions": positions,
        "college_years": college_years,
        "years": years
    }


@router.post("/selection")
def send_stat_types(selections:SelectorForm):
    pass


@router.post("/inference")
def nil_predict(selections:SelectorForm,data:DataForm):
    pass