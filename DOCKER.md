# Quickstart and Setup
This Docker setup was generated with Claude, let me know if there are any errors 
- Joshua Walther

## Choose Your Setup Method

**New to the project? Use Docker** — it handles React, Python, PostgreSQL, and all dependencies automatically with one command.  
**Docker not working on your machine?** Follow the manual setup for the backend in the [Backend.md](backend/Backend.md) file.

*[Backend.md](backend/Backend.md) also contains useful information about the structure of the backend and how it works, I recommend reading some of it if you plan on working on the backend - Joshua*
---

## Docker Setup (Recommended)

### Prerequisites
- Install [Desktop](https://www.docker.com/get-started) — this is the only thing you need to install

### Steps

**1. Clone the GitHub repo and navigate to the project root**
```
...\NowIL
```

**2. Create your `.env` file**

In the `Nowil` directory there is a `.env.example` file, copy this file and name it `.env`

The file will look like this:
```
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=nowil
DATABASE_URL=postgresql://postgres:mysecretpassword@db:5432/nowil
SECRET_KEY=your-secret-key-here
```

Replace `mysecretpassword` with any password you wish
Replace `your secret key` with one generated [here](https://jwtsecretkeygenerator.com/).

The env file will not get commited to github, and it holds all the variables that contain secret/sensitive information that should not be pubic

**3. Start all containers**
```bash
docker compose up --build
```
**DOCKER DESKTOP MUST BE OPEN TO RUN DOCKER COMMANDS ON WINDOWS** 

This will automatically:
- Start a PostgreSQL database
- Install all Python dependencies
- Start the FastAPI backend on `http://localhost:8000`

**4. Initialize the database tables**

In a second terminal:
```bash
docker compose exec backend alembic upgrade head
```

**5. Setup backend venv (Backend DEV only)**

If you plan on working in the backend, you will still need to create a python virtual environment outside of the Docker container so that VSCode IntelliSense and suggestions work.

```
cd backend
python -m venv .venv
.venv/Scripts/Activate.ps1        
pip install -r requirements.txt
```
Note: `.venv/Scripts/Activate.ps1 `  is Windows specific, if on Mac or Linux use `source venv/bin/activate`

**6. Verify servers are running**
That's it! The backend is running at `http://localhost:8000` and the API docs are at `http://localhost:8000/docs`. The frontend is running at `http:localhost:5173` .

### Useful Docker Commands
```bash
# Start containers (after first build)
docker compose up

# Stop containers
docker compose down

# View backend logs
docker compose logs backend

# Run alembic migrations after pulling changes
docker compose exec backend alembic upgrade head

# Open a shell inside the backend container
docker compose exec backend bash

# Open Postgres database terminal
docker compose exec db psql -U postgres nowil

# Reset everything including the database
docker compose down -v
```