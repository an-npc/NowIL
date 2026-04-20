from __future__ import annotations
from typing import Optional
from sqlmodel import SQLModel
from models.database_tables import CollegeYear,PositionType

  
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
    
    #FirstName,LastName,SchoolName,Sport,Pos,NIL,DeltaNIL 
    
    
class PlayerInfo(SQLModel):
    pass
    
    
class PlayerInfoBio(SQLModel):
    pass
    
    
class PlayerInfoStats(SQLModel):
    pass
    
    
class PlayerPerformance():
    pass
    