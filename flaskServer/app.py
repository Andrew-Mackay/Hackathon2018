from flask import Flask, jsonify, request
import urllib.request
import json

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
  return app.send_static_file('test.html')

@app.route('/getCities', methods=['GET'])
def getCitites():
  '''database query logic here'''
  cities = ['Glasgow', 'Aberdeen', 'Edinburgh']
  return jsonify(cities)

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