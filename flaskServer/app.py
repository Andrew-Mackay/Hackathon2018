from flask import Flask, jsonify, request
import urllib.request
from pymongo import MongoClient
from bson.code import Code
from pprint import pprint
import time
import json
import pandas as pd
import numpy as np

USE_MONGO = True

app = Flask(__name__, static_url_path='/static')

cities_df = pd.read_csv('static/uscitiesv1.4.csv')
db = MongoClient('localhost', 27017).hackathon
admissions_coll = db.admissions
cities_coll = db.cities

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/test')
def testAuto():
  return app.send_static_file('testAuto.html')

@app.route('/getCityNames')
def getCityNames():
  if USE_MONGO:
    names = cities_coll.find().distinct("_id")

  else:
    names = cities_df['city'].tolist()
  
  return jsonify(names)

# @app.route('/getCities', methods=['GET'])
# def getCitites():

#   # takes about 0.03s
#   cities = cities_coll.find().distinct("_id")

#   #cities = ['Huntsville', 'Elkmont', 'Maumelle']
#   citiesLatLng = {}
#   selectedForColumns = cities_df[['city', 'lat', 'lng']]
#   i = 0
#   for row in selectedForColumns.iterrows():
#     # print(row[0], row[1][['lat', 'lng']])
#     citiesLatLng[row[1]['city']] = row[1][['lat', 'lng']].tolist()
#     i+=1
#     if i > 8000:
#       break
#   return jsonify(citiesLatLng)

@app.route('/getPostcodes', methods=['POST'])
def getPostcodes():
  cityName = request.json['cityName']
  if USE_MONGO:
    postcodes = admissions_coll.find({"City": cityName}).distinct("Postcode")

  else:
    postcodes = ['56763', '89403', '30298']

  return jsonify(postcodes)

@app.route('/getPeople', methods=['POST'])
def getPeople():
  postCode = request.json['postCode']
  cityName = request.json['cityName']
  if USE_MONGO:
    people = admissions_coll.find({"City": cityName, "Postcode": postCode}).distinct("AccountNumber")

  else:
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