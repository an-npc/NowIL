from __future__ import annotations
from typing import Optional
from sqlmodel import SQLModel
from models.database_tables import CollegeYear

  
class PlayerTableData(SQLModel):
    first_name:str
    last_name:str
    college_year:CollegeYear
    nil:int
    delta_nil:int
    
    
class PlayerInfo(SQLModel):
    pass
    
    
class PlayerInfoBio(SQLModel):
    pass
    
    
class PlayerInfoStats(SQLModel):
    pass
    
    
class PlayerPerformance():
    pass
    