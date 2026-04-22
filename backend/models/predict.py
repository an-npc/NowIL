from __future__ import annotations
from typing import Optional
from sqlmodel import SQLModel


class SelectorForm(SQLModel):
    conference:str
    school:str
    position:str
    year:str

class DataForm(SQLModel):
    pass