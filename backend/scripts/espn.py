import requests, json

#https://github.com/pseudo-r/Public-ESPN-API
# https://github.com/pseudo-r/Public-ESPN-API/blob/main/docs/sports/football.md


#https://sports.core.api.espn.com/v2/sports/football/leagues/college-football
#https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/seasons/2025/athletes?group=8&limit=100
#https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/teams?group=8&season=2026

#Beau Allen
#http://sports.core.api.espn.com/v2/sports/football/leagues/college-football/seasons/2025/athletes/4429209?lang=en&region=us
#https://a.espncdn.com/i/headshots/college-football/players/full/4429209.png


teamID = {
    "Auburn Tigers": 0,
    "Arkansas Razorbacks": 1,
    "Florida Gators": 2,
    "Georgia Bulldogs": 3,
    "Kentucky Wildcats": 4,
    "LSU Tigers": 5,
    "Missouri Tigers": 6,
    "Ole Miss Rebels": 7,
    "Oklahoma Sooners": 8,
    "Vanderbilt Commodores": 9,
    "Texas A&M Aggies": 10,
    "Texas Longhorns": 11,
    "Alabama Crimson Tide": 12,
    "Mississippi State Bulldogs": 13,
    "South Carolina Gamecocks": 14,
    "Tennessee Volunteers": 15
}
    

def get_teams():
    response = requests.get('https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/teams?group=8&season=2025&limit=1000')
    teams = response.json()["items"]

    team_names = {}
    for team_url in teams:
        team = requests.get(team_url["$ref"]).json()
        team_names[team["displayName"]] = team
        
        
    return team_names 

def team_dict():
    response = requests.get('https://sports.core.api.espn.com/v2/sports/football/leagues/college-football/teams?group=8&season=2025&limit=1000')
    teams = response.json()["items"]

    team_names = {}
    for team_url in teams:
        team = requests.get(team_url["$ref"]).json()
        team_names[team["displayName"]] = team
        
        
    return team_names 
    
    
def get_atheletes(team_name):
    teams = get_teams()
    if teams is None:
        return
    team = teams[team_name]
   
    athlete_urls = requests.get(team["athletes"]["$ref"]+"&limit=200").json()["items"]
    
    athletes = {}
    for athlete_url in athlete_urls:
        athlete = requests.get(athlete_url["$ref"]).json()
        athletes[athlete["fullName"]] = athlete
        
    return athletes

def get_games(startdate:int,enddate:int):
    url = "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard"
    parameters = f"?groups=8&limit=100&dates={startdate}-{enddate}"
    events = requests.get(url+parameters).json()["events"]
    
    id = 0
    games = {}
    for event in events:
        try:
            if event["competitions"][0]["competitors"][0]["winner"] == "true":
                winner = event["competitions"][0]["competitors"][0]["team"]["location"]
            else :
                winner = event["competitions"][0]["competitors"][1]["team"]["location"]
                
                
            game = {
                "game_id"   :   id,
                "away_id"   :   teamID[event["competitions"][0]["competitors"][1]["team"]["displayName"]],
                "home_id"   :   teamID[event["competitions"][0]["competitors"][0]["team"]["displayName"]],
                "date"      :   event["date"],
                "location"  :   event["competitions"][0]["venue"]["fullName"],
                "away_score":   event["competitions"][0]["competitors"][0]["score"],
                "home_score":   event["competitions"][0]["competitors"][1]["score"],
                "outcome"   :   winner
            }
            games[event["name"]] = game
            id+=1
        except KeyError as e:
                print(f"Game: {event["name"]}   Date: {event["date"]}")
                print(e)
    return games


def write_rosters():
    teams = get_teams().keys()
    for team in teams:
        athletes = get_atheletes(team)
        if athletes is not None:
            filename = f"data/rosters/Team {team}.json"
            with open(filename, "w") as file:
                json.dump(athletes,file, indent=4, sort_keys=True)   


def write_teams():
    teams = get_teams().values()
    for team in teams:
        filename = f"data/teams/{team["displayName"]}.json"
        with open(filename,"w") as file:
            json.dump(team,file, indent=4, sort_keys=True)
            

def get_teams_table():
    teams = get_teams().values()
    
    id=0
    schools = {}
    for team in teams:
        school = {
            "school_id": id,
            "sport":"football",
            "school": team["location"],
            "city": team["venue"]["address"]["city"],
            "state": team["venue"]["address"]["state"],
            "color_hex_value": team["color"],
            "logo_url": team["logos"][0]["href"]
            }   
        
        schools[team["location"]] = school
        id+=1
        
    return schools

def get_players_table():
    
    teams = get_teams()
    id = 0
    player_table = {}
    for team_name,team in teams.items(): 
        
        if team["displayName"] not in teamID:
            continue
        
        players = get_atheletes(team_name).values()
        for player in players:
            try:
                player_data = {
                    "player_id":  id,
                    "first_name": player["firstName"],
                    "last_name": player["lastName"],
                    "college_year":player["experience"]["displayValue"],
                    "height":player["height"],
                    "weight":player["weight"],
                    "hometown":player["birthPlace"]["city"],
                    "homestate":player["birthPlace"]["state"],
                    "position":player["position"]["abbreviation"],
                    "number":player["jersey"],  
                    "team_id": teamID[team["displayName"]]
                } 
                player_table[player["fullName"]] = player_data
                id+=1  
            except KeyError as e:
                print(f"Team: {team_name}   Player: {player["fullName"]}")
                print(e)

    return player_table            
        
            
if __name__ == "__main__":        
    
    schools = get_teams_table()
    filename = f"data/tables/schools.json"
    with open (filename, "w") as file:
        json.dump(schools,file,indent=4)
    
    # teamIDs = {}
    # team_names = get_teams().keys()
    # teams_data = get_teams_table().values()
    # for team,team_name in zip(teams_data,team_names):
    #     teamIDs[team_name] = team["school_id"]
    # filename=f"data/teamIDS.json"
    # with open(filename,"w") as file:
    #     json.dump(teamIDs,file,indent=4)
    
    # players = get_players_table()
    # filename = f"data/tables/players.json"
    # with open (filename, "w") as file:
    #     json.dump(players,file,indent=4)
    
    # games = get_games(20250723,20260120)
    # filename = f"data/tables/games.json"
    # with open (filename, "w") as file:
    #     json.dump(games,file,indent=4)
    
   