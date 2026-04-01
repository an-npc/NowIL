# NowIL

# Members

Joshua Walther(walthe219) 		- Project Manager, Backend Lead\
Melanie J. Steiner(an-npc) 		- Git Master, Frontend Lead\
Alexis Harvey(alexisharveyyy) 	- Machine Learning & Data Lead, Backend\
Vanik Makaryan(vmakaa) 			- Design Lead, Frontend\
Kaden Casey (GITHUB) 			- Backend

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

Frontend: `http://localhost:5173/`

Backend: `http://localhost:8000/docs`


## Commands

### Docker Commands

```sh
docker compose up --build 	//inital build, after every pull or new branch
```

```sh
docker compose up 			//start docker containers 
```

```sh
docker compose down			// close docker containers
```

```sh

docker compose exec frontend COMMAND	// execute a terminal command on frontend container	
```

```sh

docker compose exec backend COMMAND		// execute a terminal command on backend container	
```

```sh

docker compose exec db COMMAND			// execute a terminal command on database container
```

