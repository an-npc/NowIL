from __future__ import annotations 
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
    Runningback = "RB"
    WideReciever = "WR"
    TightEnd = "TE"
    OffensiveLine = "OL"
    DefensiveLine = "DL"
    Linebacker = "LB"
    Cornerback = "CB"
    Safety = "S"
    
    
# DATABASE TABLES
        
# Player(PlayerID, FirstName, LastName, CollegeYear, Height, Weight, Age, HomeTown, High School)
class Player(SQLModel,table=True):
    player_id: int = Field(primary_key=True)
    first_name:str
    last_name:str
    college_year:CollegeYear
    height:float
    weight:float
    age:int
    hometown:str
    homestate:str
    high_school:str
    
    # Relationships
    positions:List[Position] = Relationship(back_populates="player")
    performances:List[Performance] = Relationship(back_populates="player")
    injuries:List[Injury] = Relationship(back_populates="player")
    
    
#School(SchoolID, SchoolName, City, State, PrimaryColor, SecondaryColor, Logo)
class School(SQLModel,table=True):
    school_id:int = Field(primary_key=True)
    name:str
    city:str
    state:str
    color_hex_value:str|None = Field(default=None)
    logo_url:str|None = Field(default=None)

    # Relationships
    teams:List[Team] = Relationship(back_populates="school")

# Sport(SportID, SportName, PlayersOnField/Team)	
class Sport(SQLModel,table=True):
    sport_id:int = Field(primary_key=True)
    name:str

    # Relationships
    teams:List[Team] = Relationship(back_populates="sport")
    

#Team(TeamID, (FK)SportID,  (FK)SchoolID) 		
class Team(SQLModel,table=True):
    team_id:int = Field(primary_key=True)
    sport_id:int = Field(foreign_key="sport.sport_id")
    school_id:int = Field(foreign_key="school.school_id")
    
    # Relationships
    sport:Sport = Relationship(back_populates="teams")
    school:School = Relationship(back_populates="teams")
    players:List[Position] = Relationship(back_populates="team")
    away_games:List[Game] = Relationship(back_populates="away_team")
    home_games:List[Game] = Relationship(back_populates="home_team")


# Position( (FK)PlayerID, (FK)TeamID, Season, Position, Number)	
class Position(SQLModel,table=True):
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    team_id:int = Field(primary_key=True, foreign_key="team.team_id")
    season:int = Field(primary_key=True) 
    type:PositionType
    number:int
    
    # Relationships
    player:Player = Relationship(back_populates="positions")
    team:Team = Relationship(back_populates="players")


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
    away_team:Team = Relationship(back_populates="away_games")
    home_team:Team = Relationship(back_populates="home_games")
    performances:List[Performance] = Relationship(back_populates="game")


#Performance( (FK)GameID, (FK)PlayerID,	NIL, NILDELTA)
class Performance(SQLModel,table=True):
    game_id:int = Field(primary_key=True, foreign_key="game.game_id")
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    nil:int
    nilt_delta:float
    
    # Relationships
    player:Player = Relationship(back_populates="performances")
    game:Game = Relationship(back_populates="performances")


# Injury( (FK)PlayerID, Type, StartDate, EndDate)	
class Injury(SQLModel,table=True):
    player_id:int = Field(primary_key=True, foreign_key="player.player_id")
    type:str = Field(primary_key=True)
    start_date:date = Field(primary_key=True)
    end_date:date

    # Relationships
    player:Player = Relationship(back_populates="injuries")

