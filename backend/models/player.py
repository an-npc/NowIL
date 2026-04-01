from __future__ import annotations 
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship 


class PlayerTest(SQLModel,table=True):
    player_id: int = Field(primary_key=True)
    name: str
    nil: Optional[int]
    delta_nil: Optional[float]