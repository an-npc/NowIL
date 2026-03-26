# Quickstart and Setup

## Choose Your Setup Method

**New to the project? Use Docker** — it handles Python, PostgreSQL, and all dependencies automatically with one command.  
**Docker not working on your machine?** Follow the [Manual Setup](#manual-setup) section below.

---

## Docker Setup (Recommended)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/get-started) — this is the only thing you need to install

### Steps

**1. Clone the repo and navigate to the project root**
```
...\NowIL
```

**2. Create your `.env` file**

In the `backend` directory, create a `.env` file:
```
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=nowil
DATABASE_URL=postgresql://postgres:mysecretpassword@db:5432/nowil
SECRET_KEY=your-secret-key-here
```

Replace `[your secret key]` with one generated [here](https://jwtsecretkeygenerator.com/).

**3. Start all containers**
```bash
docker compose up --build
```

This will automatically:
- Start a PostgreSQL database
- Install all Python dependencies
- Start the FastAPI backend on `http://localhost:8000`

**4. Initialize the database tables**

In a second terminal:
```bash
docker compose exec backend alembic upgrade head
```

That's it! The backend is running at `http://localhost:8000` and the API docs are at `http://localhost:8000/docs`.

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

# Reset everything including the database
docker compose down -v
```

### Switching Between Local and Shared Database

You can swap between your local Docker database and the shared Supabase database using two env files.

Create `.env.local` (your local Docker database):
```
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=nowil
DATABASE_URL=postgresql://postgres:mysecretpassword@db:5432/nowil
SECRET_KEY=your-secret-key-here
```

Create `.env.staging` (shared Supabase database — get credentials from the team):
```
DB_USER=postgres
DB_PASSWORD=mysecretpassword
DB_NAME=nowil
DATABASE_URL=postgresql://postgres:mysecretpassword@db.xxxx.supabase.co:6543/postgres
SECRET_KEY=[your secret key]
```

Swap between them by copying to `.env`:
- Windows: `copy .env.local .env` or `copy .env.staging .env`
- Mac/Linux: `cp .env.local .env` or `cp .env.staging .env`

Then restart Docker: `docker compose down && docker compose up`

> **Never commit `.env`, `.env.local`, or `.env.staging` to GitHub.** Only `.env.example` should be committed. Share Supabase credentials with teammates securely (e.g. Discord, Notion).

---

## Manual Setup

Use this if Docker isn't working on your machine. Make sure you are in the backend directory before starting.

```
...\NowIL\ cd backend
...\NowIL\backend
```

Some of these steps can happen at the same time and there can be waiting for things to download — do multiple steps at once where possible.

### Prerequisites
- Install Python
- Install PostgreSQL [here](https://www.postgresql.org/download/) — this takes a while, do other steps while it downloads

### 1. Create a Python virtual environment and install dependencies

First create a venv and install all Python dependencies.

**MAKE SURE YOU ARE IN THE BACKEND DIRECTORY.**

```bash
python -m venv .venv
```

Activate it (command depends on your OS and terminal):
- Windows PowerShell: `./.venv/Scripts/Activate.ps1`
- Mac/Linux: `source .venv/bin/activate`

Then install dependencies:
```bash
pip install -r requirements.txt
```

If using VS Code you may need to manually select the correct Python interpreter:
1. Press `CTRL + SHIFT + P`
2. Select `Python: Select Interpreter`
3. Choose `.venv(3.12.9) \backend\.venv\Scripts\python.exe`

### 2. Set up your local PostgreSQL database

When you install PostgreSQL for the first time it will ask you to create a user and password. Keep the default username `postgres` and set your own password.

Run `psql` on your computer (the PostgreSQL command line interface). When it launches, press ENTER to accept defaults for Server, Database, Port, and Username — only enter your password. You are signed in when the prompt shows `postgres=#`.

Create a new database for NowIL:
```sql
create database nowil;
```

The terminal will print `CREATE DATABASE` if successful. Switch to it with `\c nowil`.

#### Helpful psql Commands

All SQL commands end with `;`. All PostgreSQL-specific commands begin with `\` and do not end with `;`.

Viewing the database:
- `\l` — view all databases
- `\c DBNAME` — switch to a database
- `\dt` — view all tables in the current database
- `select * from TABLENAME;` — view records in a table

Testing commands (the backend handles these for us normally):
- `create table NAME;` — create a table
- `drop table TABLENAME;` — delete a table
- `insert into TABLENAME values(v1,v2,...);` — insert a record
- `delete from TABLENAME where CONDITION;` — delete a record

**IMPORTANT: Drop any tables you manually created before moving forward.**

### 3. Create a `.env` file

Create a `.env` file in the `backend` directory:
```
DATABASE_URL=postgresql://[username]:[password]@localhost/nowil
SECRET_KEY=[secret key]
```

Replace `[username]` with your postgres username (default is `postgres`), `[password]` with your password, and `[secret key]` with one generated [here](https://jwtsecretkeygenerator.com/).

### 4. Initialize database tables with Alembic

Alembic manages migrations for our database — think of it like Git for the database structure. It generates code to move between different versions of the database while preserving existing data.

> **Important:** Never manually change the database using the psql terminal. Always use Alembic.  
> **Note:** Alembic only stores table structure, not data. Data is shared between machines via Supabase.

**IMPORTANT: Drop any tables you manually created before running this.**

Make sure you are in the backend directory, then apply current migrations:
```bash
alembic upgrade head
```

Since there are no tables yet, this will create all missing tables.

#### Making database changes going forward

If you change a model in the model class files, save the changes as a new Alembic revision:
```bash
alembic revision --autogenerate -m "description of change"
```

Then apply the changes:
```bash
alembic upgrade head
```

Commit the generated migration file to Git so teammates can run `alembic upgrade head` to stay in sync.
