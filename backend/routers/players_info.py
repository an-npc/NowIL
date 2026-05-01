from typing import List,Sequence,Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col,func, desc, union_all 
from database import get_session

from models.database_tables import PositionType,Player, Performance,Team, Game, QBPerformance, WRPerformance, LBPerformance, TEPerformance, SPerformance
from models.player import PlayerTableData, PlayerBaseData,PlayerInfo, PlayerInfoBio, PlayerInfoStats, PlayerInfoBrand, PlayerPerformance


router = APIRouter(prefix="/players", tags=["Players"])


def get_pos_table(position:PositionType) -> type:
    match position.value:
        case "QB":
            PosTable = QBPerformance
        case "WR":
            PosTable = WRPerformance
        case "LB":
            PosTable = LBPerformance
        case "TE":
            PosTable = TEPerformance
        case "S":
            PosTable = SPerformance
        case _:
            raise HTTPException(500,"Player has unsupported position " + position)
    return PosTable


@router.get("", response_model=List[PlayerTableData]|List[PlayerBaseData])
def get_players_data(
        team_id:int|None = None,
        basenil:bool = False,
        limit:int = 10,
        offset:int = 0,
        session:Session = Depends(get_session)
    ):
    
    # if want players base nil only
    if basenil:
        tabledata = session.exec(
            select(
                Player.player_id,
                Player.first_name,
                Player.last_name,
                Player.position,
                Player.college_year,
                Player.headshot_url,
                Team.sport,
                Team.school,
                Player.base_nil
            ) # type:ignore
            .join(Team)
            .order_by(col(Player.base_nil).desc())
            .limit(limit)
            .offset(offset)
        ).all()

        return tabledata
    
    
    # if want players most recent nil evaluation from a performance 
    
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
            Player.headshot_url,
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


@router.get("/{player_id}", response_model=PlayerTableData|PlayerBaseData)
def get_player_data(player_id:int,basenil:bool=False,session:Session = Depends(get_session)):
    
    if basenil:
        indvidualdata = session.exec(
                select(
                    Player.player_id,
                    Player.first_name,
                    Player.last_name,
                    Player.position,
                    Player.college_year,
                    Player.headshot_url,
                    Team.sport,
                    Team.school,
                    Player.base_nil
                ) # type:ignore
                .join(Team)
                .where(Player.player_id==player_id)
            ).first()
        return indvidualdata
    
    else:
        indvidualdata = session.exec(
            select(
                Player.player_id,
                Player.first_name,
                Player.last_name,
                Player.position,
                Player.college_year,
                Player.headshot_url,
                Team.sport,
                Team.school,
                Performance.nil,        
                Performance.nil_delta   
            ) # type:ignore
            .join(Team)
            .join(Performance)
            .join(Game)
            .where(Player.player_id==player_id)
            .order_by(col(Game.date).desc())
        ).first()

        return indvidualdata
    

@router.get("/{player_id}/info", response_model = PlayerInfo)
def get_player_info(player_id,session:Session = Depends(get_session)):
    
    player = session.get(Player,player_id)
    if not player: 
        raise HTTPException(404,"Player not found")
    
    bio = session.exec(
        select(
            Team.school,
            Player.college_year,
            Player.position,
            Player.number,
            Player.hometown,
            Player.homestate,
            Player.height,
            Player.weight
        ) # type:ignore
        .join(Team)
        .where(Player.player_id==player_id)
    ).first()
    
    brand = PlayerInfoBrand.model_validate(
        session.exec(
            select(
                Player.base_nil,
                col(Performance.nil).label("highest_nil")
            )
            .join(Performance)
            .order_by(col(Performance.nil).desc())
        ).first()
    )
    
    
    stats = PlayerInfoStats(labels=[],values=[])
   
    
    return PlayerInfo(bio=bio,stats=stats,brand=brand)


@router.get("/{player_id}/performances", response_model=List[PlayerPerformance])
def get_player_performances(player_id:int,session:Session = Depends(get_session)):
    
    player = session.get(Player,player_id)
    if not player:
        raise HTTPException(404, "Player not found")
    
    home_games = (
        select(
            col(Game.date).label("date"), # Label clearly for sorting
            col(Team.school).label("opponent"),
            col(Game.outcome),
            col(Game.home_score).label("team_score"),
            col(Game.away_score).label("opponent_score"),
            col(Performance.nil),
            col(Performance.nil_delta)
        ) # type:ignore
        .join(Performance, Game.game_id == Performance.game_id) 
        .join(Player, Performance.player_id == Player.player_id)
        .join(Team, Team.team_id == Game.away_id) 
        .where(Player.player_id == player_id, Game.home_id == Player.team_id)
    )

    away_games = (
        select(
            col(Game.date).label("date"),
            col(Team.school).label("opponent"),
            col(Game.outcome),
            col(Game.away_score).label("team_score"),
            col(Game.home_score).label("opponent_score"),
            col(Performance.nil),
            col(Performance.nil_delta)
        ) # type:ignore
        .join(Performance, Game.game_id == Performance.game_id) 
        .join(Player, Performance.player_id == Player.player_id)
        .join(Team, Team.team_id == Game.home_id) 
        .where(Player.player_id == player_id, Game.away_id == Player.team_id)
    )

    # Combine and apply ordering to the final statement
    stmt = union_all(home_games, away_games).order_by(col(Game.date).desc())

    # Execute
    performances = session.exec(stmt).all()
    
    return performances


