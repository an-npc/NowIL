from __future__ import annotations
from typing import Optional, Any, List
from sqlmodel import SQLModel
from models.database_tables import CollegeYear,PositionType
from datetime import date

  
class PlayerTableData(SQLModel):
    player_id:int
    first_name:str
    last_name:str
    school:str
    sport:str
    position:PositionType
    college_year:CollegeYear
    nil:int
    nil_delta:float
    headshot_url:str


class PlayerBaseData(SQLModel):
    player_id:int
    first_name:str
    last_name:str
    school:str
    sport:str
    position:PositionType
    college_year:CollegeYear
    base_nil:int
    headshot_url:str

    
  
class PlayerInfoBio(SQLModel):
    school:str
    college_year:str
    position:PositionType
    number:int
    hometown:str
    homestate:str
    height:float
    weight:float
    
    
class PlayerInfoStats(SQLModel):
    labels:list
    values:list
    
    
class PlayerInfoBrand(SQLModel):
    base_nil:int
    highest_nil:int
    
    
class PlayerInfo(SQLModel):
    bio:PlayerInfoBio
    stats:PlayerInfoStats
    brand:PlayerInfoBrand
    
    
class PlayerPerformance(SQLModel):
    date:date
    opponent:str
    outcome:str
    team_score:int
    opponent_score:int
    nil:int
    nil_delta:float
    