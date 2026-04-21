from typing import List,Sequence,Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col, func, desc
from database import get_session

from models.database_tables import Player, Performance, Team, Game
from models.player import PlayerTableData
from routers.shared import get_current_nil_subquery


router = APIRouter(prefix="/players", tags=["player"])

@router.get("/data", response_model=List[PlayerTableData])
def get_players_data(
        team_id:int|None = None,
        position:str|None = None,
        college_year:str|None = None,
        limit:int = 1,
        offset:int = 0,
        session:Session = Depends(get_session)
    ):
    
    # Use shared subquery to get current NIL values for each player
    current_nils = get_current_nil_subquery()

    # 3. Main query
    tabledata = session.exec(
        select(
            Player.player_id,
            Player.first_name,
            Player.last_name,
            Player.position,
            Player.college_year,
            Team.sport,
            Team.school,
            current_nils.c.nil,        
            current_nils.c.nil_delta   
        ) # type:ignore
        .join(Team)
        .join(current_nils, Player.player_id == current_nils.c.player_id) # Explicit join
        .order_by(current_nils.c.nil.desc())
        .limit(limit)
        .offset(offset)
    ).all()

    return tabledata


@router.get("/{player_id}/data", response_model=PlayerTableData)
def get_player_info(playerID,session:Session = Depends(get_session)):
    pass


