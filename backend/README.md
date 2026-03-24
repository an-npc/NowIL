# NowIL - Backend

This readme will get you started with the backend

## Setup
This section will instruct you on how to setup the backend.  
Eventually Docker will automate alot of this process.  
If your not already make sure you are in the backend directory.  
`...\NowIL\ cd backend`.  
`...\NowIL\backend`.


### Prequisites
- install Python
- install PostgreSQL, run psql and set password

### 1. Create a python virtual environment and install dependencies
First you need to create a venv and install all of the python dependencies.

`python -m venv .venv`  
For Windows Powershell: `./.venv/Scripts/Activate.ps1`.  
This command depends on your operating system and CLI

Then install dependencies: `pip install -r requirements.txt`

if using vscode the you may have to manually select the correct python interpreter
use `CTRL + SHIFT + P`  
then select `Python: Select Interpreter`  
you may have to manually select the interpreter path
it should be `.venv(3.12.9) .\backend\.venv\Scripts\python.exe`

### 2. Create a .env file
Next you need to create a .env file that holds all of the secrets that should remain hidden and CANNOT be commited to GitHub for security

In the Backend directory create a `.env` file:

```
DATABASE_URL=postgresql://[username]:[password]@localhost/nowil` 
SECRET_KEY=[your secrect key]
```

use your postgres username (usually just postgres by default) and password, you will need to [generate a secret key](https://jwtsecretkeygenerator.com/)

### 3. Initialize database with Alembic

Alembic manages migrations for our database, think of it like Git for the database.
If we want to make a change to the logical structure of the database in code without losing data, Alembic automatically generates the code to move between different versions of the database while preserving existing data. With alembic it is important that you never manually change the database using the psql terminal with PostgreSQL.

`alembic revision --autogenerate -m "NAME"`

`alemic upgrade heaed`


### 4. Run backend server locally
For our backend we are using the FastAPI framework. This framework will be explained in the next section.

To run our backend: `fastapi dev`   
This command will start the backend server locally on your machine, 
go to `http://127.0.0.1:8000` to verify it works

## FastAPI
At this point the backend should be setup and running. This section will explain the structure of the backend and how to make changes. The [FastAPI Documentation](https://fastapi.tiangolo.com/tutorial/) is a very helpful, but lengthy resource, consult it for a more in depth explaination.

#### Why use FastAPI?
Its in the name, FastAPI is a fast, modern, and clean python backend framework.
- supports asynchronious calls
- uses type annotations
- reduces reduant code writting using SQLModel
- automatically generates documentation, can be used to test without a frontend

#### API Basics
This explains very briefly the basics of backend APIs, if you already understand what an API is you can skip this.

A web application is composed of three parts, a client application, a server, and a database. The frotend controls the client application, the backend is what runs on the server, An API connects our frontend to our backend, and our backend server to the database. The frontend makes HTTP requests to the backend API for data, the backend fetches that data from the database, and returns and HTTP response in JSON with the data. 

### Routers
Our API functions are organized into what FastAPI calls routers. They are a collection of api endpoints. A router defines a common prefix for all endpoints within it

### Models
We use SQLModel to create Model classes that define the structure of our tables as well as any JSON data we want to recieve or send. These structures also validates data formats making sure it is correct

### Automatic Documentation