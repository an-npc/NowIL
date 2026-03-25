from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.user import User,UserRegister,UserResponse
from database import get_session

router = APIRouter(prefix="/user")

@router.post("/register")
def register_user(data:UserRegister,session:Session = Depends(get_session)):
    # check if user is already registered
    # generate user_id
    # hash password
    # create user and add to database
    # send token and user_id
    pass

@router.post("/login")
def login_user(data:UserRegister,session:Session = Depends(get_session)):
    # check if user is user exists
    # check if hashed password matches stored hash
    # send token and user_id
    pass

@router.delete("/{user_id}")
def delete_user(user_id:int,token,session:Session = Depends(get_session)):
    # check if user is user 
    # check if user token is valid
    # delete user and revoke token  1
    pass
