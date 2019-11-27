from flask import Flask, request, render_template, jsonify
from flask_json import FlaskJSON, JsonError, json_response, as_json
import psycopg2
# uuse psycopg2 to set up connection to db
conn = psycopg2.connect(host="localhost",database="Project2", user="postgres", password="postgres")

cursor = conn.cursor()
print( conn.get_dsn_parameters(), )

app = Flask(__name__)

@app.route("/")
def index():
  return render_template("index.html")

# Route to render index.html template using data from Postgres
@app.route("/api/barchart")
def bar():
  pg_barchart = "select * FROM barchart"
  cursor.execute(pg_barchart)
  bar_data = cursor.fetchall()
  print(bar_data)
  return jsonify(bar_data)

@app.route("/api/map")
def map():
  pg_mapdata = "select * FROM mapdata"
  cursor.execute(pg_mapdata)
  map_data = cursor.fetchall()
  print(map_data)
  return jsonify(map_data) 

@app.route("/api/weekly")
def week():
  pg_weeklydata = "select * FROM weeklydata"
  cursor.execute(pg_weeklydata)
  weekly_data = cursor.fetchall()
  print(weekly_data)
  return jsonify(weekly_data)

@app.route("/api/yearly")
def year():
  pg_yearlydata = "select * FROM yearlydata"
  cursor.execute(pg_yearlydata)
  yearly_data = cursor.fetchall()
  print(yearly_data)
  return jsonify(yearly_data)    

@app.route("/api/activites")
def activites():
  pg_activities = "select * FROM activities"
  cursor.execute(pg_activities)
  activity_data = cursor.fetchall()
  print(activity_data)
  return jsonify(activity_data) 
  
if __name__ == "__main__":
  app.run()