#used to initialize database and create database session for path operation functions
from sqlmodel import SQLModel,Session,create_engine
from os import getenv
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = getenv("DATABASE_URL")
assert DATABASE_URL, "DATABASE_URL environment variable not set in .env file. If this file does not exist create it."
engine = create_engine(DATABASE_URL)


def create_db():
    SQLModel.metadata.create_all(engine)
    

def get_session():
    with Session(engine) as session:
        yield session