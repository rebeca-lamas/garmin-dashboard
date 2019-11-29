from flask import Flask, request, render_template, jsonify
from flask_json import FlaskJSON, JsonError, json_response, as_json
import psycopg2
# uuse psycopg2 to set up connection to db
conn = psycopg2.connect(host="localhost",database="garmin", user="postgres", password="postgres")

cursor = conn.cursor()
print( conn.get_dsn_parameters(), )

app = Flask(__name__)

@app.route("/")
def index():
  return render_template("index.html")

# Route to render index.html template using data from Postgres
@app.route("/api/barchart")
def bar():
  # PostgreSQL_select_Query1 = "select column_name, data_type from information_schema.columns where table_name = 'barchart';"
  # cursor.execute(PostgreSQL_select_Query1)
  # bar_col = cursor.fetchall()
  # col_name1 = []
  # for col, dtype in bar_col:
  #   col_name1.append(col)
  pg_barchart = "select * FROM barchart"
  cursor.execute(pg_barchart)
  bar_values = cursor.fetchall()
  col_name1 = ["name", "2016", "2017", "2018", "2019"]
  dict_list1 = []
  for element in bar_values:
    x = dict(zip(col_name1, element))
    dict_list1.append(x)
  print('bar data pulled')
  return jsonify(dict_list1)

@app.route("/api/map")
def map():
  # PostgreSQL_select_Query2 = "select column_name, data_type from information_schema.columns where table_name = 'mapdata';"
  # cursor.execute(PostgreSQL_select_Query2)
  # map_col = cursor.fetchall()
  # col_name2 = []
  # for col, dtype in map_col:
  #   col_name2.append(col)
  pg_map = "select * FROM mapdata"
  cursor.execute(pg_map)
  map_values = cursor.fetchall()
  dict_list2 = []
  col_name2 = ['activity_type', 'title', 'distance', 'start_latitude', 'start_longitude', "total_time"]
  for element in map_values:
    x = dict(zip(col_name2, element))
    dict_list2.append(x)
  print('map data pulled')
  return jsonify(dict_list2)

@app.route("/api/weekly")
def week():
  # PostgreSQL_select_Query3 = "select column_name, data_type from information_schema.columns where table_name = 'weeklydata';"
  # cursor.execute(PostgreSQL_select_Query3)
  # weekly_col = cursor.fetchall()
  # col_name3 = []
  # for col, dtype in weekly_col:
  #   col_name3.append(col)
  pg_map = "select * FROM weeklydata"
  cursor.execute(pg_map)
  weekly_values = cursor.fetchall()
  dict_list3 = []
  col_name3 = ['day', 'hour', 'values']
  for element in weekly_values:
    x = dict(zip(col_name3, element))
    dict_list3.append(x)
  print('week data pulled')
  return jsonify(dict_list3)

@app.route("/api/yearly")
def year():
  # PostgreSQL_select_Query4 = "select column_name, data_type from information_schema.columns where table_name = 'yearlydata';"
  # cursor.execute(PostgreSQL_select_Query4)
  # yearly_col = cursor.fetchall()
  # col_name4 = []
  # for col, dtype in yearly_col:
  #   col_name4.append(col)
  pg_year = "select * FROM yearlydata"
  cursor.execute(pg_year)
  year_values = cursor.fetchall()
  col_name4 = ["Date", "value"]
  dict_list4 = []
  for element in year_values:
    x = dict(zip(col_name4, element))
    dict_list4.append(x)
  print('year data pulled')
  return jsonify(dict_list4)    

@app.route("/api/activities")
def activities():
  # PostgreSQL_select_Query5 = "select column_name, data_type from information_schema.columns where table_name = 'activities';"
  # cursor.execute(PostgreSQL_select_Query5)
  # activity_col = cursor.fetchall()
  # col_name5 = []
  # for col, dtype in activity_col:
  #   col_name5.append(col)
  pg_activities = "select * FROM activities"
  cursor.execute(pg_activities)
  activity_values = cursor.fetchall()
  col_name5 = ["Activity Type", "Date", "Title", "Distance", "Calories", "Duration", "Average HR", 
          "Max HR", "Average Pace", "Best Pace", "Steps", "Start Latitude", "Start Longitude"]
  dict_list5 = []
  for element in activity_values:
    x = dict(zip(col_name5, element))
    dict_list5.append(x)
  print('activities data pulled')
  return jsonify(dict_list5) 
  
if __name__ == "__main__":
  app.run()