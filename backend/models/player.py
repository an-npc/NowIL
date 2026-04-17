from __future__ import annotations
from typing import Optional
from sqlmodel import SQLModel
from models.database_tables import CollegeYear

  
class PlayerTableData(SQLModel):
    id:int
    first_name:str
    last_name:str
    school_name:str
    sport:str
    pos:str
    college_year:CollegeYear
    nil:int
    delta_nil:float
    
    #FirstName,LastName,SchoolName,Sport,Pos,NIL,DeltaNIL 
    
    
class PlayerInfo(SQLModel):
    pass
    
    
class PlayerInfoBio(SQLModel):
    pass
    
    
class PlayerInfoStats(SQLModel):
    pass
    
    
class PlayerPerformance():
    pass
    