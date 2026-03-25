from __future__ import annotations 
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship 



class UserRegister(SQLModel):
    email:str
    password:str

class UserResponse(SQLModel):
    user_id:int
    email:str

class User(SQLModel,table=True):
    user_id:int = Field(primary_key=True)
    email:str
    hashed_password:str