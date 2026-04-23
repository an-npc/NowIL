<<<<<<< Updated upstream
from __future__ import annotations 
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship 
from typing import List


class Team(SQLModel, table=True):
    team_id: int = Field(primary_key=True)
    name: str
    conference: Optional[str] = None
=======
from __future__ import annotations
from typing import Optional
from sqlmodel import SQLModel
from models.database_tables import CollegeYear, PositionType


class TeamTableData(SQLModel):
    team_id: int
    school: str
    sport: str
    city: str | None
    state: str | None
    color_hex_value: str | None
    logo_url: str | None
    total_players: int
    total_nil_value: int
    avg_nil_value: float


class TeamInfo(SQLModel):
    pass


class TeamInfoBio(SQLModel):
    pass


class TeamInfoStats(SQLModel):
    pass


class TeamPerformance(SQLModel):
    pass
>>>>>>> Stashed changes
