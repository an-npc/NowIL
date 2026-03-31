# NowIL - Backend
Written by Joshua Walther, msg me with any questions!

****

This README will get you started with setting up the backend aswell explaining the strucutre of the backend and how FastAPI works. 

To get started running the backend all you NEED to read is the Quickstart section, however I reccomend reading the other sections as well if you would like to work on the backend. If you just need to setup the backend server on your computer to test it or connect it to the frontend, the Quickstart section is sufficent 


# Table Contents
- [NowIL - Backend](#nowil---backend)
- [Table Contents](#table-contents)
- [Backend Tech Stack](#backend-tech-stack)
- [Backend file structure](#backend-file-structure)
- [Quickstart and Setup **REQUIRED**](#quickstart-and-setup-required)
  - [Prequisites](#prequisites)
  - [1. Create a python virtual environment and install dependencies](#1-create-a-python-virtual-environment-and-install-dependencies)
  - [2. Setup your local PostgreSQL database](#2-setup-your-local-postgresql-database)
    - [Commands](#commands)
  - [3. Create a .env file](#3-create-a-env-file)
  - [4. Initialize database tables with Alembic](#4-initialize-database-tables-with-alembic)
  - [5. Run backend server locally](#5-run-backend-server-locally)
  - [FastAPI Automatic Docs](#fastapi-automatic-docs)
- [APIs and FastAPI](#apis-and-fastapi)
    - [Why use FastAPI?](#why-use-fastapi)
  - [API Basics](#api-basics)
    - [HTTP](#http)
    - [REST API](#rest-api)
  - [API Functions](#api-functions)
  - [Routers](#routers)
  - [Models](#models)

# Backend Tech Stack
- Python for programming language
- FastAPI for python framework
- PostgreSQL for relational database
- SQLModel libray for database access and data validation
- Alembic library for database migrations
- PyTorch for machine learning
- Docker for project setup and managment
- Supabase for database hosting


# Backend file structure
The *backend* directory contains all of the backend files and directorys:
- .venv: python virtual environment
- alembic: stores database migration files and version from alembic
- models: contains all of our model classe defining our tables and JSON formats
- routers: contains all of our API routers classes with API functions
- main.py: runs on start, creates the FastAPI app, registers routers with the app
- database.py: creates and setup database engine and session fuction
- requirements.txt: all python dependecies and packages
- .env: contains all secret variables that cannot be commited to git, DB password, secret key

# Quickstart and Setup **REQUIRED**
This section will instruct you on how to setup the backend manually so that you can run it on your machine if Docker is not working.  

**I RECOMMEND TRYING TO SETUP WITH DOCKER FIRST, IT ONLY TAKES ONE COMMAND, IF IT DOESNT WORK RETURN HERE. CONSULT /nowil/DOCKER.MD**

If your not already make sure you are in the backend directory.  
`...\NowIL\ cd backend`.  
`...\NowIL\backend`.

Some of these steps can happen at the same time, and there can be waiting for things to download I suggest doing multiple of these at once.


## Prequisites
- install Python
- install PostgreSQL [here](https://www.postgresql.org/download/). This takes awhile to install, do other steps while it does.

## 1. Create a python virtual environment and install dependencies
Requirements: python installed

First you need to create a venv and install all of the python dependencies.

MAKE SURE YOU ARE IN THE BACKEND DIRECTORY! i always forget

`python -m venv .venv`  
For Windows Powershell: `./.venv/Scripts/Activate.ps1`.  
This command depends on your operating system and CLI

Then install dependencies: `pip install -r requirements.txt`

if using vscode the you may have to manually select the correct python interpreter
use `CTRL + SHIFT + P`  
then select `Python: Select Interpreter`  
you may have to manually select the interpreter path
it should be `.venv(3.12.9) \backend\.venv\Scripts\python.exe`

## 2. Setup your local PostgreSQL database
Requirements: PostgreSQL downloaded

When you install PostgresSQL for the first time it will ask you to create a user and password. For username keep the default postgres. Create your own password.

Run psql on your computer, it is the command line interface for postgreSQL. When you launch, it will ask you to enter a Server, Database, Port, Username, and Password consecutively. Just select the default option for most things by pressing ENTER. They only thing you need to enter is your password. You are signed in when the command line looks like `postgres=#`.

The `postgres` in the command line is saying that you are in the default postgres database. You will need to create a new database for NowIL using the command `create database nowil;`. The terminal will print `CREATE DATABASE` if succesful. To switch to the new data base type `\c nowil`.

### Commands
You now have PostgreSQL setup, here are some basic commands that are helpful to use postgres, although this is not required to setup the rest of the backend.

All SQL commands end in a `;`, all PostgreSQL specific commands begin with `\` and do not end in `;`.

Use these commands to view changes to the database:
- To view all databases use `\l`.
- To change to another database use `\c DBNAME`.
- To view all tables in your database use `\dt`.
- To view the records in a table use `select * from TABLENAME;`.

Use these commands for testing, but the backend should perform these for us:
- To create a table use `create table NAME;`.
- To delete a table use `drop table TABLENAME;`
- To insert a new record in a table use `insert into TABLEname values(v1,v2,....);`
- To delete a record in a table use `delete from TABLEname where=CONDITION;`

You can use any other SQL statemets to manipulate data in the tables, use google to find the commands you neeed.

IMPORTANT: MAKE SURE TO DROP ALL TABLES YOU CREATE BEFORE MOVING FORWARD


## 3. Create a .env file
Requirements: PostgresSQL password set

Next you need to create a .env file that holds all of the secrets that should remain hidden and CANNOT be commited to GitHub for security

In the Backend directory create a `.env` file:

```
DATABASE_URL=postgresql://[username]:[password]@localhost/nowil` 
SECRET_KEY=[secrect key]
```

Replace [username] with your postgres username (postgres by default) and [password] with the password. Replace [secret key] with your own; you need to [generate a secret key here](https://jwtsecretkeygenerator.com/)

## 4. Initialize database tables with Alembic
Requirements: python dependencies installed

Alembic manages migrations for our database, think of it like Git for the database strucutre.
If we want to make a change to the logical structure of the database in code without losing data, Alembic automatically generates the code to move between different versions of the database while preserving existing data. With alembic it is important that you never manually change the database using the psql terminal with PostgreSQL. 

NOTE: Alembic does not store data itself, only the table structures. We will need to share database data between machines some other way, likely by hosting it using an external site like Supabase.

IMPORTANT: MAKE SURE TO DROP ANY TABLES YOU CREATED IN THE DATABASE BEFORE MOVING FORWARD


First make sure you are in the backend directory

To update the tables to the current strucutre or 'pull' changes use the command:   
`alemic upgrade heaed`

Since there are no tables in the database currently it will create all the tables you are missing.

If you make changes to the table models in the model class files, to 'commit' them to the database you have to save the changes using alembic by creating a new revision:   

`alembic revision --autogenerate -m "VERSION NAME"`

then apply or 'pull' the changes using:
`alemic upgrade heaed`

## 5. Run backend server locally
Requirements: All previous steps completed
For our backend we are using the FastAPI framework. This framework will be explained in the next section.

To run our backend: `fastapi dev`   
This command will start the backend server locally on your machine, 
go to `http://127.0.0.1:8000` to verify it works

## FastAPI Automatic Docs
FastAPI also automatically generates a documentation with an interactive frontend using OpenAPI allowing you to test and understand backend endpoints without using a real frontend and without looking at backend code. This is really helpful!. To test that the backend and database are working go to `http://127.0.0.1:8000/docs`. 

The endpoints are organized into differnet catagorizes based on their routers, expanding one of these will show all of the endpoints and there methods. Expand one of these endpoints to show the parameters the endpoint takes from the frontend and example successful and failing HTTP requests. You can also click the *Try it button* to create your own request by filling in the parameters, and send it. This will actually send the request to the backend server and you will get a real response 

Try using POST, GET, and DELETE methods to add, get, and delete records from your local database. Verify that these are correctly updating the database by using the psql terminal and viewing the records in the tables after each method call.

# APIs and FastAPI
At this point the backend should be setup and running. This section will explain the structure of the backend and how to make changes. The [FastAPI Documentation](https://fastapi.tiangolo.com/tutorial/) is a very helpful, but lengthy resource, consult it for a more in depth explaination.

### Why use FastAPI?
Its in the name, FastAPI is a fast, modern, and clean python backend framework.
- supports asynchronious calls
- uses type annotations
- reduces reduant code writting using SQLModel
- automatically generates documentation, can be used to test without a frontend

## API Basics
This explains the basics of backend APIs, if you already understand what an API is you can skip this.

A web application is composed of three parts, a client application, a server, and a database. The frotend controls the client application, the backend is what runs on the server managing the behind the scenes logic and data for our website. Our API allows our frontend to talk to the backend, and our backend server to connect to the database. The frontend makes HTTP requests to the backend API for data, the backend fetches that data from the database, and returns and HTTP response in JSON with the data. 

### HTTP
HTTP requests are used to send and recieve data on the web. In our case the frontend sends HTTP requests to the backend, the backend sends HTTP responses back. 

HTTP requests have a few parts, URL, Method, Header, and Body: 
- URL: where the message is going.
- Method: what HTTP method is being performed (GET, POST, DELETE, PUT, etc.)
- Header: holds meta data like what format the data is in (JSON or form) and cookies
- Body: holds the data being sent (usually in JSON format), used only for POST, PUT, and PATCH methods.
  
HTTP is stateless, meaning there is no memory between requests, each request is like a unique unknown user. We use tokens and cookies, aswell as our database, to store information needed between requests, like a token saying a user is still signed in.

There are a few key HTTP Methods:
- POST: used to send lots of data, to create something or to carry user credentials
- GET: used to retrieve/read data
- PUT/PATCH: used to update data, PUT replaces the data completly, PATCH updates only parts of the data
- DELETE: used to delete data

HTTP response have a status code like 200,201,404,500 to indicate the result of a request, a Header with metadata, and a body to send back data in JSON usually

### REST API
We are creating what is called a REST API, it uses HTTP requests to communicate between the frontend and backend. There are four key CRUD operations used by a REST API

CRUD:
- Create: use HTTP POST method to create new data in our database 
- Read: use HTTP Get method to fetch data from database and return it 
- Update: use HTTP PUT/PATCH to update existing data in the our database
- Delete: use HTTP DELETE to delete existing data in our database
 
You can see how the HTTP methods from above map to our four API operations.

## API Functions
Known as path operator functions in FastAPI, we write our API functions to create endpoints for API that can be called by the frontend. Each function has a URL its accessible by and an HTTP method:

```
@router.get("/players", response_model=List[Player])
def get_players():
    ...
```
The `@router.get()` says this function uses the GET method, and `"/players"` says that the relative URL for this function is ../players. `response_model` just says that we will  return a list of player records from our database.

Each function can also take in paremeters, either path paremeters in the URL path like `/{name}`, query parameters at the end of the url like `%?postion=qb?school=lsu`, or request body parmeters from the HTTP Body.

```
@router.get("/{player_id}", response_model=Player)
def get_player(player_id:int, session:Session = Depends(get_session)):
    ...
```

The above function gets a single player from our datbase. It also uses the GET method, but it has a path parameter in the URL `/{player_id}` telling us what player_id we want to get. With `def get_player` we define the actual function and in the paremeters we have `player_id:int` the path parameter and `session:Session` which creates a connection to our database.

```
@router.post("/player", response_model=Player,status_code=201)
def create_player(data:Player,session:Session = Depends(get_session)):
    player = Player(player_id=data.player_id,name=data.name,nil=data.nil,delta_nil=data.delta_nil)
    session.add(player)
    session.commit()
    session.refresh(player)
    return player
```
The above function `create_player` creates a new player in the database. The `@rotuer.post` means it runs from a POST method. As a parameter `data:Player` says we are taking in data from the HTTP body that matches the format of Player which we define in our Model classes explained later. It also has `session:Session` which creates a connection with the database.  We then create a new Player object based on the data in the body. We add this player to the database using `session.add(player)` and commit the change using `session.commit()` then return the created player data back to the frontend.


## Routers
Our API functions are organized into what FastAPI calls routers. They are a collection of api endpoints. A router defines a common url prefix for all endpoints within it. We can then add the API functions we write to these routers, then register these routers with our API. This organizes are endpoints very nicely.

`router = APIRouter(prefix="/player")`   
this creates a router with the prefix `/player`
```
@router.get("/{player_id}", response_model=Player)
def retrieve_player(player_id:int,session:Session=Depends(get_session)):
    .........
```       
we add a function to the router using `@router.get` where the `get` just specifies the HTTP method that calls this function. The url then for this function would be `../player/{player_id}` because it will have the prefix of the router it is added to

`app.include_router(players.router)`
This then registers our router to are API app itself.

Routers are not required to use FastAPI but they make are API more organized and allow for a hiearchical structure of routers, sub routers, and API endpoints.

## Models
We use the SQLModel library to create SQLModel classes that define the structure of database tables and of any JSON data sent or received by the server. SQLModel was created by the maker of FastAPI, and combines two existing python libraries SQLAlchemy and Pydantic to reduce reduant code writting

SQLModel serves two functions, first it is a Object Relational Mapping (ORM), it allows us to manipulate a database using object classes in another language(python) instead of writting raw SQL statements in our database. It talks to our database by establising connections to the database, performs operations, and commits changes made in that session before closing. 

```
#Table model
class User(SQLModel,table=True):
    user_id:int = Field(primary_key=True)
    email:str
    hashed_password:str
```
This defines a table in our database with `user_id` as a primary key, and additional attributes email and hashed_password. When we make changes to this table or create new table classes, we can use `alembic revisions` to sae the changes and `alembic upgrade` to apply the changes to our local database. 

We can write SQLModel classes not only to represent tables for our database, but also it define the strucute of any JSON data the API will send or recieve. This is SQLModel's second function. Each model defines its variables and their types, as well as any restrictions like length, or optionality. These models will try to fit any incoming and outgoing data to the correct types if possible, but if the data cannot be put in the correct format it throws an error.

```
#JSON models
class UserRegister(SQLModel):
    email:str
    password:str

class UserResponse(SQLModel):
    user_id:int
    email:str
```
These two models define what data we expect to send and recieve for our User. For a user to signup they just need to send their email and password, and when we respond we dont want to sned their password or hashed_password back, but we need to send the user_id back so they know their user number