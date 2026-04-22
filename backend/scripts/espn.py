import requests
import json
from typing import Callable
from models.database_tables import PositionType
import random

#https://github.com/pseudo-r/Public-ESPN-API
#https://github.com/pseudo-r/Public-ESPN-API/blob/main/docs/sports/football.md

'''
A collection of methods used to fetch data from ESPN API,
extract relevat data needed for table records,
and write to or read JSON files containing these records

Stores JSON files in data/tables/ 
'''


'''
Team Methods
'''
# fetch list of all teams from espn api
# returns dict[espn_id, team_data]
def fetch_teams_data() -> dict:
    
    url = "https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/teams"
    parameters = {"group": 8,"season": 2025, "limit": 100} # SEC is group 8
    
    response = requests.get(url,parameters)
    team_urls = response.json()["items"]
    
    teams = {}
    for team_url in team_urls:
        team_data = requests.get(team_url["$ref"]).json()
        teams[team_data["id"]] = team_data
        
    return teams 


# takes espn data and extracts data needed for Team table records
# returns dict[espn_id,team_record]
def create_team_records() -> dict:
    teams = fetch_teams_data().values()
    
    school_id=0
    team_records = {}
    for team_data in teams:
        team = {
            "espn_id": team_data["id"],
            "team_id": school_id,
            "sport":"Football",
            "school": team_data["location"],
            "city": team_data["venue"]["address"]["city"],
            "state": team_data["venue"]["address"]["state"],
            "color_hex_value": team_data["color"],
            "logo_url": team_data["logos"][0]["href"]
            }   
        
        team_records[team_data["id"]] = team
        school_id += 1
    return team_records


'''
Player Methods
'''
# fetches the players on each teams roster from espn api
# returns a dict[team_table_id, dict[player_espn_id, player_data ]]
def fetch_rosters_data() -> dict:
    teams = read_or_fetch("teams",create_team_records).values()
    
    rosters = {}
    for team in teams:
        
        espn_id = team["espn_id"]
        url = (
            f"http://sports.core.api.espn.com/v2/sports/football/leagues/college-football/"
            f"seasons/{2025}/teams/{espn_id}/athletes"
        )
        parameters = {"lang": "en", "region": "us", "limit":200} #?lang=en&region=us
        athlete_urls = requests.get(url,parameters).json()["items"]
    
        print(f"fetching team {team['team_id']}'s roster...")
        athletes = {}
        for athlete_url in athlete_urls:
            
            athlete = requests.get(athlete_url["$ref"]).json()
            athletes[athlete["id"]] = athlete
            
        rosters[team["team_id"]] = athletes
        
    return rosters


def create_player_records() -> dict:
    
    rosters = fetch_rosters_data()
    
    player_id = 0
    player_table = {}
    for team_id,roster in rosters.items(): 
            
        players = roster.values()
        for player in players:
            try:
                # Test to see if the position is supported in the database
                # will throw error if not
                pos = player["position"]["abbreviation"]
                PositionType(pos)
                    
                player_data = {
                    "espn_id": player["id"],
                    "player_id":  player_id,
                    "first_name": player["firstName"],
                    "last_name": player["lastName"],
                    "college_year":player["experience"]["displayValue"],
                    "height":player["height"],
                    "weight":player["weight"],
                    "hometown":player["birthPlace"]["city"],
                    "homestate":player["birthPlace"]["state"],
                    "position":player["position"]["abbreviation"],
                    "number":player["jersey"],  
                    "team_id": team_id,
                    "base_nil":-1,
                } 
                player_table[player["id"]] = player_data
                player_id+=1  
            except KeyError as e:
                print(f"Team table id: {team_id}   Player: {player['fullName']}")
                print(e)
            except ValueError as e:
                print(f"Team table id: {team_id}   Player: {player['fullName']}")
                print(e)

    return player_table  


'''
Game Methods
'''
def fetch_game_data(startdate:int,enddate:int) -> dict:
    url = "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard"
    parameters = f"?groups=8&limit=100&dates={startdate}-{enddate}"
    events = requests.get(url+parameters).json()["events"]
    
    games = {}
    for event in events:
        games[event["id"]] = event
    return games

def create_game_records() -> dict:
    events = fetch_game_data(20250723,20260120).values()
    teams = read_or_fetch("teams",create_team_records)
    
    game_id = 0
    games = {}
    for event in events:
        try:
            if event["competitions"][0]["competitors"][0]["winner"] == "true":
                winner = event["competitions"][0]["competitors"][0]["team"]["location"]
            else :
                winner = event["competitions"][0]["competitors"][1]["team"]["location"]
            
            team0_espn_id = event["competitions"][0]["competitors"][0]["team"]["id"]
            team1_espn_id = event["competitions"][0]["competitors"][1]["team"]["id"]
                
            game = {
                "espn_id"   :   event["competitions"][0]["id"],
                "game_id"   :   game_id,
                "away_id"   :   teams[team0_espn_id]["team_id"],
                "home_id"   :   teams[team1_espn_id]["team_id"],
                "date"      :   event["date"],
                "location"  :   event["competitions"][0]["venue"]["fullName"],
                "away_score":   event["competitions"][0]["competitors"][0]["score"],
                "home_score":   event["competitions"][0]["competitors"][1]["score"],
                "outcome"   :   winner
            }
            games[game["espn_id"]] = game
            game_id+=1
        except KeyError as e:
                print(f"Game: {event['name']}   Date: {event['date']}")
                print(e)
    return games


'''
Performance Methods
'''
def fetch_performances_data(game_id) -> dict:
    url = "https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary"
    parameters = f"?groups=8&limit=1&event={game_id}"
    game = requests.get(url+parameters).json()["boxscore"]
    
    performances = {}
    teams = game["players"]
    for team in teams:
        statistics = team["statistics"]
        for stat_group in statistics:
            athletes = stat_group["athletes"]
            for athlete in athletes:
                performances[athlete["athlete"]["id"]]=athlete   
    return performances

def create_performance_records() -> dict:
    games = read_or_fetch("games",create_game_records)
    players = read_or_fetch("players",create_player_records)
    
    performances_records = {}
    for espn_game_id in games:
        performances = fetch_performances_data(espn_game_id)
        for espn_player_id in performances:
            try:
                performances_data = {
                    "game_id": games[espn_game_id]["game_id"],
                    "player_id": players[espn_player_id]["player_id"],
                    "nil": -1,  #generate_random_nil(),
                    "nil_delta": -1 #generate_random_delta(),
                }
                key = f"{espn_game_id}-{espn_player_id}"
                performances_records[key] = performances_data
            except KeyError as e:
                print(f"Game: {espn_game_id}   Player: {espn_player_id}")
                print(e)
    return performances_records

'''
MISC
'''
# gets all the types of college football positions in ESPN API
def fetch_position_types():
    url = "https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/positions"
    parameters = {"limit":100}
    pos_urls = requests.get(url,parameters).json()["items"]
    positions = {}
    for pos_url in pos_urls:
        try:
            pos = requests.get(pos_url["$ref"]).json()
            positions[pos["abbreviation"]] = pos
        except KeyError as e:
            print(e)
    return positions

def generate_random_nil():
    return random.randint(10000,100000)

def generate_random_delta():
    return random.normalvariate(0,.25)

            
'''
I/O METHODS
'''
# creates a json file from a dict of table records
def write_table(table_records:dict, file_name:str) -> None:
    filepath=f"data/tables/{file_name}.json"
    with open(filepath,"w") as file:
        json.dump(table_records,file,indent=4)
        

# reads a json file representing a table
# returns as a python dictonary if the file exists
# else returns None
def read_table(table_file_name:str) -> dict|None:
    filepath = f"data/tables/{table_file_name}.json"
    try:
        with open(filepath,"r") as file:
            table_records = json.load(file)
            return table_records
    except FileNotFoundError as e:
        return None


# reads data if it exists, else fetchs data and writes it  
# avoids fetching data again if its already been collected
def read_or_fetch(file_name:str, create_records_func:Callable[[],dict])-> dict:
    result = read_table(file_name)
    if result is not None:
        return result
    else:
        records = create_records_func()
        write_table(records,file_name)
        return records


# collects Team, Player, Game, and Performance from ESPN API
# writes as JSON files to data/tables/
def collect_all_data() -> None:
    print("Begining collection process!")
    tables = [
        ("teams",create_team_records),
        ("players", create_player_records),
        ("games", create_game_records),
        ("performances",create_performance_records),
    ]
    for table_name,create_func in tables:
        print(f"Fetching {table_name} data...")
        write_table(create_func(),table_name)
        print(f"Saving data at data/tables/{table_name}.json")
    print(f"This data can be inserted into the database using insert_database.py")
        
    
    
if __name__ == "__main__": 
    #write_table(create_team_records(),"teams")
    #write_table(create_player_records(),"players")
    # write_table(create_game_records(),"games")
    #write_table(create_performance_records(),"performances")
    collect_all_data()