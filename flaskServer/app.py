from flask import Flask, jsonify, request
import urllib.request
from pymongo import MongoClient
from bson.code import Code
from pprint import pprint
import time
import json
import pandas as pd

app = Flask(__name__, static_url_path='/static')

cities_df = pd.read_csv('static/uscitiesv1.4.csv')
db = MongoClient('localhost', 27017).hackathon
admissions_coll = db.admissions
cities_coll = db.cities

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/getCities', methods=['GET'])
def getCitites():

  # takes about 0.03s
  cities = cities_coll.find().distinct("_id")

  #cities = ['Huntsville', 'Elkmont', 'Maumelle']
  citiesLatLng = {}
  for city in cities:
    latLng = cities_df.loc[cities_df['city'] == city][['lat', 'lng']].iloc[0]
    citiesLatLng[city] = latLng.tolist()

  return jsonify(citiesLatLng)

@app.route('/getPostcodes', methods=['POST'])
def getPostcodes():
  cityName = request.json['cityName']
  postcodes = admissions_coll.find({"City": cityName}).distinct("Postcode")
  # postcodes = ['56763', '89403', '30298']
  return jsonify(postcodes)

@app.route('/getPeople', methods=['POST'])
def getPeople():
  postCode = request.json['postCode']
  cityName = request.json['cityName']
  people = admissions_coll.find({"City": cityName, "Postcode": postCode}).distinct("AccountNumber")
  # people = ['person1', 'person2', 'person3']
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