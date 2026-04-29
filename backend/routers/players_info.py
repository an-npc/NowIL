from typing import List,Sequence,Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col, func, desc
from database import get_session

from models.database_tables import Player, Performance, Team, Game
from models.player import PlayerTableData
from sqlmodel import Session, select, col,func, desc 
from database import get_session
from models.database_tables import Player, Performance,Team, Game
from models.player import PlayerTableData

router = APIRouter(prefix="/players", tags=["player"])

@router.get("/data", response_model=List[PlayerTableData])
def get_players_data(
        team_id:int|None = None,
        position:str|None = None,
        college_year:str|None = None,
        limit:int = 10,
        offset:int = 0,
        session:Session = Depends(get_session)
    ):
    
    # Use shared subquery to get current NIL values for each player
    # 1. Subquery to rank performances per player by date
    # We use row_number() to pick the single newest record
    subq = (
        select(
            Performance.player_id,
            Performance.nil,
            Performance.nil_delta,
            func.row_number().over(
                partition_by=col(Performance.player_id),
                order_by=desc(Game.date)
        ).label("rn")
        )
        .join(Game)
        .subquery()
    )

    # 2. Filter for only the #1 ranked row (the current one)
    current_nils = select(subq).where(subq.c.rn == 1).subquery() # type:ignore

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


