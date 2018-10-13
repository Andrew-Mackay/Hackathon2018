from flask import Flask, jsonify, request
import urllib.request
import json

app = Flask(__name__)

@app.route('/')
def index():
  return "done"

@app.route('/getCities', methods=['GET'])
def getCitites():
  '''database query logic here'''
  cities = ['Glasgow', 'Aberdeen', 'Edinburgh']
  return jsonify(cities)

@app.route('/getPostcodes', methods=['POST'])
def getPostcodes():
  cityName = request.form['cityName']
  '''database query logic here'''
  postcodes = ['G127BG', 'AQWFGH', 'FGH423']
  return jsonify(postcodes)

@app.route('/getPeople', methods=['POST'])
def getPeople():
  postCode = request.form['postCode']
  '''database query logic here'''
  people = ['person1', 'person2', 'person3']
  return jsonify(people)

@app.route('/getIllness', methods=['POST'])
def getIllness():
  illnessCode = request.form['illnessCode']
  illnessDescription = translateIllnessCode(illnessCode)
  return jsonify(illnessDescription)


def translateIllnessCode(illnessCode):
  baseURL = "http://www.icd10api.com/?code="
  getRequest = baseURL + illnessCode
  response = urllib.request.urlopen(getRequest).read()
  return json.loads(response.decode())['Description']

if __name__ == "__main__":
  app.run()