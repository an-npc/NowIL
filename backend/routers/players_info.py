from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session

from models.database_tables import Player, Performance, Position
from models.player import PlayerTableData


router = APIRouter(prefix="/players", tags=["player"])

@router.get("", response_model=PlayerTableData)
def get_players( session:Session = Depends(get_session)):
    pass


@router.get("/{player_id}", response_model=PlayerTableData)
def get_player_info(playerID,session:Session = Depends(get_session)):
    pass



# SQL Command to get player info for table
'''sql
SELECT FirstName,LastName,SchoolName,Sport,Pos,NIL,DeltaNIL 
FROM Player NATURAL JOIN(
	SELECT Type as Pos
	FROM Position
	ORDER BY Season ASC
	LIMIT1
) NATURAL JOIN (
	SELECT SchoolName
    FROM School
) NATURAL JOIN (
	SELECT NIL, DeltaNIL
	FROM Performance
	ORDER BY Date ASC
	LIMIT 1
) 
ORDER BY NIL ASC;
'''
