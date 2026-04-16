from typing import List,Sequence,Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from database import get_session

from models.database_tables import Player, Performance,Team
from models.player import PlayerTableData


router = APIRouter(prefix="/players", tags=["player"])

@router.get("", response_model=List[PlayerTableData])
def get_players(session:Session = Depends(get_session)):
    
    players = session.exec(select(Player))
    table:List[PlayerTableData] = []
    
    for player in players:
        team = player.team
        performance = player.performances[0]
        
        data:PlayerTableData = PlayerTableData(
            first_name=player.first_name,
            last_name=player.last_name,
            school_name=team.school,
            sport=team.sport,
            pos = player.position,
            college_year=player.college_year,
            nil=performance.nil,
            delta_nil=performance.nilt_delta
            )
        table.append(data)

    return table 


@router.get("/{player_id}", response_model=PlayerTableData)
def get_player_info(playerID,session:Session = Depends(get_session)):
    pass



# SQL Command to get player info for table

'''
SELECT FirstName,LastName,SchoolName,Sport,Pos,NIL,DeltaNIL
Player -> First,Last, PlayerID
Position -> Pos, PlayerID, TeamID | Most Recent
Team -> TeamID, SchoolID, SportID
Sport -> SportName
School -> SchoolName
Performance -> NIL,DeltaNIL, GameID, Player | Most Recent
'''

