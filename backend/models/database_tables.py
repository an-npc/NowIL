from typing import Optional,List
from sqlmodel import SQLModel, Field, Relationship 
from enum import Enum
from datetime import date

'''
Contains all of the SQLModel table classes for our database.
If any new tables added/removed, make sure to update alembic/env.py imports

Database Schema: 
https://docs.google.com/spreadsheets/d/15IPL0w0pzPMONMbBcK4yUYHJ0Yc0lmZaoS0uEOIzv_c/edit?usp=sharing
'''

#Enums defining value domains
class CollegeYear(str,Enum):
    Freshman = "Freshman"
    Sophomore = "Sophomore"
    Junior = "Junior"
    Senior = "Senior"

class PositionType(str,Enum):
    Quaterback = "QB"
    WideReciever = "WR"
    TightEnd = "TE"
    Linebacker = "LB"
    Safety = "S"
    
# DATABASE TABLES
        
# Player(PlayerID, FirstName, LastName, CollegeYear, Height, Weight, Age, HomeTown, High School)
class Player(SQLModel,table=True):
    player_id: int = Field(primary_key=True)
    first_name:str
    last_name:str
    college_year:CollegeYear|None
    height:float|None
    weight:float|None
    hometown:str|None
    homestate:str|None
    headshot_url:str
    
    position:PositionType
    number:int|None
    
    team_id:int = Field(foreign_key="team.team_id")
    
    base_nil:int
    
    # Relationships
    performances:List["Performance"] = Relationship(back_populates="player")
    team:"Team" = Relationship(back_populates="players")
    
    

#Team(TeamID, (FK)SportID,  (FK)SchoolID) 		
class Team(SQLModel,table=True):
    team_id:int = Field(primary_key=True)
    sport:str 
    school:str
    city:str|None
    state:str|None
    color_hex_value:str|None = Field(default=None)
    logo_url:str|None = Field(default=None)
    
    # Relationships
    players:List[Player] = Relationship(back_populates="team")
    away_games:List["Game"] = Relationship(back_populates="away_team", sa_relationship_kwargs={"foreign_keys": "[Game.away_id]"})
    home_games:List["Game"] = Relationship(back_populates="home_team", sa_relationship_kwargs={"foreign_keys": "[Game.home_id]"})


# Game(GameID, Date, (FK)AwayTID,  (FK)HomeTID, Location, AwayScore, HomeScore, Outcome)						
class Game(SQLModel,table=True):
    game_id:int = Field(primary_key=True)
    away_id:int = Field(foreign_key="team.team_id")
    home_id:int = Field(foreign_key="team.team_id")
    date:date
    location:str
    away_score:int
    home_score:int
    outcome:str

    # Relationships
    away_team:"Team" = Relationship(back_populates="away_games",sa_relationship_kwargs={"foreign_keys": "[Game.away_id]"})
    home_team:"Team" = Relationship(back_populates="home_games",sa_relationship_kwargs={"foreign_keys": "[Game.home_id]"})
    performances:List["Performance"] = Relationship(back_populates="game")


#Performance( (FK)GameID, (FK)PlayerID,	NIL, NILDELTA)
class Performance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    nil:int
    nil_delta:float
    
    # Relationships
    player:"Player" = Relationship(back_populates="performances")
    game:"Game" = Relationship(back_populates="performances")


class QBPerformance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    rush_yards:int
    pass_tds:int
    ints:int
    rush_tds: int
    completion_pct: float
    pass_yards: int


class WRPerformance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    receiving_yards:int
    receiving_tds:int
    receptions:int
    yards_per_rec:float


class TEPerformance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    receiving_yards: int
    receiving_tds: int
    receptions:int


class LBPerformance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    pass_breakups:int
    def_ints:int
    solo_tackles:int
    sacks:int
    tfl:int
    forced_fumbles:int
    total_tackles:int


class SPerformance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    pass_breakups:int 
    def_ints:int
    solo_tackles:int
    fumble_recoveries:int
    defensive_tds:int
    forced_fumbles:int
    total_tackles:int

