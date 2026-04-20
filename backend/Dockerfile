FROM pytorch/pytorch:2.6.0-cpu-cxx11-abi

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "8000"]
