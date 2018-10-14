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

def getIllness(drg):
  baseURL = "http://www.icd10api.com/?code="
  getRequest = baseURL + drgCode
  response = urllib.request.urlopen(getRequest).read()
  return json.loads(response.decode())['Description']


def generate_person_blob(account_no, cityName, postCode):
    admissions = admissions_coll.find({"City": cityName, "Postcode": int(postCode), "AccountNumber": account_no})
    admission_headers = set(["AdmissionDate", "DischargeDate", "Drg", "Cpt", "ServiceDate", "DaysOrUnits", "Charges"])
    person_blob = {}
    raw_data = {}

    all_ads = []
    for ad in admissions:
        raw_data = ad
        admission_blob = {}
        for header in admission_headers:
            admission_blob[header] = ad[header]
        admission_blob['Illness'] = getIllness(admission_blob['Drg'])
        all_ads.append(admission_blob)
    
    for key in raw_data.keys():
        if key not in admission_headers:
            person_blob[key] = ad[key]

    person_blob["admissions"] = all_ads
    del person_blob["_id"]
    return person_blob

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
  people = []

  if USE_MONGO:
    acc_nos = admissions_coll.find({"City": cityName, "Postcode": int(postCode)}).distinct("AccountNumber")
    print(postCode, cityName, acc_nos)
    for no in acc_nos:
      people.append(generate_person_blob(no, cityName, postCode))

  else:
    people = ['person1', 'person2', 'person3']

  return jsonify(people)

if __name__ == "__main__":
  app.run()