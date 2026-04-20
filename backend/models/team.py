from __future__ import annotations 
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship 
from typing import List


class Team(SQLModel, table=True):
    team_id: int = Field(primary_key=True)
    name: str
    conference: Optional[str] = None
