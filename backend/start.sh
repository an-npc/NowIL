#!/bin/sh
alembic upgrade head
echo "DEBUG: alembic run"
fastapi dev main.py --host 0.0.0.0 --port 8000