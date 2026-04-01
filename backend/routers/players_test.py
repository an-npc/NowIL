from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.player import PlayerTest
from database import get_session

router = APIRouter(prefix="/player", tags=["Test Player"])

@router.get("/{player_id}", response_model=PlayerTest)
def get_player(player_id:int, session:Session = Depends(get_session)):
    
    player = session.get(PlayerTest,player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return player

@router.post("", response_model=PlayerTest,status_code=201)
def create_player(data:PlayerTest,session:Session = Depends(get_session)):
    
    player = PlayerTest(player_id=data.player_id,name=data.name,nil=data.nil,delta_nil=data.delta_nil)
    
    session.add(player)
    session.commit()
    session.refresh(player)
    
    return player

@router.delete("/{player_id}", response_model=PlayerTest)
def delete_player(player_id:int,session:Session = Depends(get_session)):
    
    player = session.get(PlayerTest,player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    
    session.delete(player)
    session.commit()
    
    return player   


# SQL COMMAND for Player Table
'''
SELECT FirstName,LastName,School,Team,Position,NIL,DeltaNIL 
FROME Player NATURAL JOIN (
	SELECT NIL, DeltaNIL
	FROM Performance
	ORDER BY Date ASC
	LIMIT 1
)
ORDER BY NIL ASC;
'''
