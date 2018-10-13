from flask import Flask, jsonify, request
import urllib.request
import json
import pandas as pd
import numpy as np

app = Flask(__name__, static_url_path='/static')

cities_df = pd.read_csv('static/uscitiesv1.4.csv')
# a = np.transpose(np.array([25.051961, -80.476056]))
# b = np.transpose(np.array([5322,4392]))
# x = np.linalg.solve(a, b)
# print(x)
# minLat = cities_df['lat'].min()
# maxLat = cities_df['lat'].max()
# minLng = cities_df['lng'].min()
# maxLng = cities_df['lng'].max()
# normalisedLat = (cities_df['lat'] - minLat)/(maxLat - minLat)
# normalisedLng = (cities_df['lng'] - minLng)/(maxLng - minLng)
# normalisedLat = cities_df['lat']/maxLat
# normalisedLng = cities_df['lng']/maxLng
# cities_df['lat'] = normalisedLat
# cities_df['lng'] = normalisedLng

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/test')
def testAuto():
  return app.send_static_file('testAuto.html')

@app.route('/getCityNames')
def getCityNames():
  names = cities_df['city'].tolist()
  return jsonify(names)

@app.route('/getCities', methods=['GET'])
def getCitites():
  '''database query logic here'''
  # Make sure cities are in the format Elkmont, not ELKMONT (plz).
  # cities = ['Huntsville', 'Elkmont', 'Maumelle']
  # citiesLatLng = {}
  # for city in cities:
  #   latLng = cities_df.loc[cities_df['city'] == city][['lat', 'lng']].iloc[0]
  #   citiesLatLng[city] = latLng.tolist()
  citiesLatLng = {}
  selectedForColumns = cities_df[['city', 'lat', 'lng']]
  i = 0
  for row in selectedForColumns.iterrows():
    # print(row[0], row[1][['lat', 'lng']])
    citiesLatLng[row[1]['city']] = row[1][['lat', 'lng']].tolist()
    i+=1
    if i > 8000:
      break
  return jsonify(citiesLatLng)

@app.route('/getPostcodes', methods=['POST'])
def getPostcodes():
  cityName = request.json['cityName']
  '''database query logic here'''
  postcodes = ['56763', '89403', '30298']
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