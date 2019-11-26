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

if __name__ == "__main__":
  app.run()