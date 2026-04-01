from __future__ import annotations 
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship 


class Test(SQLModel):
    name:str = Field(primary_key=True)
    num:int = Field(unique=True)
    alive:bool
    
