from typing import List, Sequence, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col, func, desc
from database import get_session

from models.database_tables import Player, Performance, Team, Game
from models.team import TeamTableData
from routers.shared import get_current_nil_subquery


router = APIRouter(prefix="/teams", tags=["team"])


@router.get("/data", response_model=List[TeamTableData])
def get_teams_data(
        sport: str | None = None,
        state: str | None = None,
        limit: int = 100,
        offset: int = 0,
        session: Session = Depends(get_session)
    ):
    
    # Use shared subquery to get current NIL values for each player
    current_nils = get_current_nil_subquery()

    # Subquery to count players and sum NIL values per team (Can be used to rank teams by total NIL's if we want)
    team_stats = (
        select(
            Player.team_id,
            func.count(Player.player_id).label("total_players"),
            func.coalesce(func.sum(current_nils.c.nil), 0).label("total_nil_value")
        )
        .join(current_nils, Player.player_id == current_nils.c.player_id)
        .group_by(Player.team_id)
        .subquery()
    )

    query = (
        select(
            Team.team_id,
            Team.school,
            Team.sport,
            Team.city,
            Team.state,
            Team.color_hex_value,
            Team.logo_url,
            func.coalesce(team_stats.c.total_players, 0).label("total_players"),
            func.coalesce(team_stats.c.total_nil_value, 0).label("total_nil_value"),
            (
                func.coalesce(team_stats.c.total_nil_value, 0) / 
                func.nullif(func.coalesce(team_stats.c.total_players, 0), 0)
            ).label("avg_nil_value")
        )
        .outerjoin(team_stats, Team.team_id == team_stats.c.team_id)
        .order_by(team_stats.c.total_nil_value.desc())
        .limit(limit)
        .offset(offset)
    )

    # Search filters
    if sport:
        query = query.where(Team.sport == sport)
    if state:
        query = query.where(Team.state == state)

    results = session.exec(query).all()
    return results


@router.get("/{team_id}/data", response_model=TeamTableData)
def get_team_info(
        team_id: int,
        session: Session = Depends(get_session)
    ):
    
    # Subquery to get the latest NIL values per player
    player_nils = (
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

    current_nils = select(player_nils).where(player_nils.c.rn == 1).subquery()

    # Subquery to count players and sum NIL values per team
    team_stats = (
        select(
            Player.team_id,
            func.count(Player.player_id).label("total_players"),
            func.coalesce(func.sum(current_nils.c.nil), 0).label("total_nil_value")
        )
        .join(current_nils, Player.player_id == current_nils.c.player_id)
        .group_by(Player.team_id)
        .subquery()
    )

    # Main query
    result = session.exec(
        select(
            Team.team_id,
            Team.school,
            Team.sport,
            Team.city,
            Team.state,
            Team.color_hex_value,
            Team.logo_url,
            func.coalesce(team_stats.c.total_players, 0).label("total_players"),
            func.coalesce(team_stats.c.total_nil_value, 0).label("total_nil_value"),
            (
                func.coalesce(team_stats.c.total_nil_value, 0) / 
                func.nullif(func.coalesce(team_stats.c.total_players, 0), 0)
            ).label("avg_nil_value")
        )
        .outerjoin(team_stats, Team.team_id == team_stats.c.team_id)
        .where(Team.team_id == team_id)
    ).first()

    if not result:
        raise HTTPException(status_code=404, detail="Team not found")

    return result


@router.get("/{team_id}/players", response_model=List[Player])
def get_team_players(
        team_id: int,
        position: str | None = None,
        college_year: str | None = None,
        session: Session = Depends(get_session)
    ):
    """
    Returns all players on a specific team.
    Optional filters: position, college_year
    """
    query = select(Player).where(Player.team_id == team_id)

    if position:
        query = query.where(Player.position == position)
    if college_year:
        query = query.where(Player.college_year == college_year)

    results = session.exec(query).all()
    return results