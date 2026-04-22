from typing import List,Sequence,Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col,func, desc 
from database import get_session

from models.database_tables import Player, Performance,Team, Game

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("")
def search(q:str, session:Session = Depends(get_session)):
    pass
