from .espn import read_table
from sqlmodel import Session
from database import engine
from models.database_tables import Team, Player, Game, Performance,QBPerformance,WRPerformance,LBPerformance,TEPerformance,SPerformance
from sqlalchemy.exc import IntegrityError


'''
Use JSON data files to insert records into database
'''

# manually insert each record and validate using SQLModel
def insert_into_table(filename:str,Table:type):
                
    data = read_table(filename)
    if data is None:
        raise RuntimeError(f"Could not find a {filename}.json in the data/tables folder. Make sure this file exisits in the correct location, data/tables/{filename}.json") 

    data = data.values()
    with Session(engine) as session:
        records = [Table(**item) for item in data]
        session.add_all(records)
        
        session.commit()
        
if __name__ == "__main__":
    print("Begining insertion process!")
    tables = [
        ("teams",Team),
        ("players", Player),
        ("games", Game),
        ("performances",Performance),
        ("qb_performances",QBPerformance),
        ("wr_performances",WRPerformance),
        ("lb_performances",LBPerformance),
        ("te_performances",TEPerformance),
        ("s_performances",SPerformance),
        
    ]
    for table_name,Table in tables:
        try:
            print(f"Inserting data into {table_name}...")
            insert_into_table(table_name,Table)
            print(f"Data added to {table_name} successfully")
        except IntegrityError as e:
            print(f"{table_name} data has duplicate keys or has already been inserted, skipping it")
    print("Data insertion complete")
        

                