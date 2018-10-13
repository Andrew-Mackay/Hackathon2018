from flask import Flask, jsonify, request
import urllib.request
import json
import pandas as pd

app = Flask(__name__, static_url_path='/static')

cities_df = pd.read_csv('static/uscitiesv1.4.csv')

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/getCities', methods=['GET'])
def getCitites():
  '''database query logic here'''
  # Make sure cities are in the format Elkmont, not ELKMONT (plz).
  cities = ['Huntsville', 'Elkmont', 'Maumelle']
  citiesLatLng = {}
  for city in cities:
    latLng = cities_df.loc[cities_df['city'] == city][['lat', 'lng']].iloc[0]
    citiesLatLng[city] = latLng.tolist()

  return jsonify(citiesLatLng)

@app.route('/getPostcodes', methods=['POST'])
def getPostcodes():
  cityName = request.json['cityName']
  '''database query logic here'''
  postcodes = ['G127BG', 'AQWFGH', 'FGH423']
  return jsonify(postcodes)

@app.route('/getPeople', methods=['POST'])
def getPeople():
  postCode = request.json['postCode']
  '''database query logic here'''
  people = ['person1', 'person2', 'person3']
  return jsonify(people)

@app.route('/getDrg', methods=['POST'])
def getDrg():
  drgCode = request.json['drgCode']
  drgDescription = translateDrgCode(drgCode)
  return jsonify(drgDescription)


def translateDrgCode(drgCode):
  baseURL = "http://www.icd10api.com/?code="
  getRequest = baseURL + drgCode
  response = urllib.request.urlopen(getRequest).read()
  return json.loads(response.decode())['Description']

if __name__ == "__main__":
  app.run()