from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.player import Player
from database import get_session

router = APIRouter(prefix="/player", tags=["Player"])

@router.get("/{player_id}", response_model=Player)
def get_player(player_id:int, session:Session = Depends(get_session)):
    player = session.get(Player,player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.post("", response_model=Player,status_code=201)
def create_player(data:Player,session:Session = Depends(get_session)):
    player = Player(player_id=data.player_id,name=data.name,nil=data.nil,delta_nil=data.delta_nil)
    session.add(player)
    session.commit()
    session.refresh(player)
    return player

@router.delete("/{player_id}", response_model=Player)
def delete_player(player_id:int,session:Session = Depends(get_session)):
    player = session.get(Player,player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    session.delete(player)
    session.commit()
    return player   