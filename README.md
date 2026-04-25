# NowIL

# Members

Joshua Walther(walthe219) 		- Project Manager, Backend Lead\
Melanie J. Steiner(an-npc) 		- Git Master, Frontend Lead\
Alexis Harvey(alexisharveyyy) 	- Machine Learning & Data Lead, Backend\
Vanik Makaryan(vmakaa) 			- Design Lead, Frontend\
Kaden Casey (KadenC707) 		- Backend

# About Our Software

NowIL

## Tech Stack

**Frontend**:
- **React.js** - Frontend Framework in JavaScript/HTML
- **Tailwind.css**- CSS Framework
- **Vite** - Build manager
- **Rechart** - React chart library
- **React Routing** - React routing library to make multipage app

**Backend**:
- **FastAPI** - Backend Framework in Python
- **SQLModel** - ORM, Interface with Database using Python only 
- **PostgreSQL** - Relational Database Management System
- **Alembic** - Database migrations, like git for database structure, prevents data loss
- **PyTorch** - machine learning library


# Important Links

Product Specification Document: [PDF](NowIL_PSD.pdf)

Product Design Document: [PDF](NowIL_UIUX.pdf)

High Fidelity Wireframe: [Figma](https://www.figma.com/design/hzr285in43N14pHKeMljPY/NowIL?node-id=1669-162202&t=ZPnLkDJtEfXeQfWw-1)

Database Schema: [Google Sheet](https://docs.google.com/spreadsheets/d/15IPL0w0pzPMONMbBcK4yUYHJ0Yc0lmZaoS0uEOIzv_c/edit?usp=sharing)


# How to Run Dev Environment

## Setup

Follow instructions in [DOCKER.md](DOCKER.md) file to setup using Docker

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Make sure you have all parts of the project setup and running

Both of these links should work if project is running correctly

Frontend: http://localhost:5173/

Backend: http://localhost:8000/docs


## Commands

### Docker Commands
Use these commands to build, start, and close down docker containers, required to use project  
**DOCKER DESKTOP MUST BE OPEN TO RUN COMMANDS ON WINDOWS** 

```sh
docker compose up --build 	//inital build, after every pull, new branch, or package
```

```sh
docker compose up 			//start docker containers 
```

```sh
docker compose down			// close docker containers
```

```sh

docker compose down -v	    / / close docker containers and delete your db data	
```

### Frontend Commands

Run these in the frontend container specifically 

```sh

docker compose exec frontend COMMAND		// execute a terminal command on frontend container	
```

or

```sh
docker compose exec frontend bash		// open fronted terminal to execute commands directly
```

Commands:
```sh
npm run dev             //restart or start frontend server
```

```sh
npm install PACKAGENAME     //install a Node.js package
```


### Backend Commands

Run these in the backend container specifically

```sh

docker compose exec backend COMMAND		// execute a terminal command on backend container	
```

or

```sh
docker compose exec backend bash		// open backedn terminal to execute commands directly
```


Commands:

```sh
fastapi dev             //restart or start backend server
```

```sh
alembic revision --autogenerate -m "Revision description"     //save changes to database schema
```

```sh
alembic upgrade head        //apply changes to database schema to your database
```

```sh
pip install PACKAGENAME     //install new python package, rebuild docker after
```


### Datbase Commands
Run these in the database container specifically

```sh

docker compose exec db COMMAND			// execute a terminal command on database container
```

or

```sh
docker compose exec db bash		// open database terminal to execute commands directly
```

Commands:

```sh
psql -U postgres nowil          //open psql, the postgres command line interface
```

```sh
\dt                             //in psql, show all tables in database
```

```sh
select * from TABLENAME;         //in psql, see all records in TABLENAME
```