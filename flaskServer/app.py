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
  postcodes = ['56763', '89403', '30298','86763', '59403', '55298','56563', '89303', '30198','56263', '89303', '30228','34141','78909','37363','26373','18181','11112','90897','38394','51617','04927',"11000", "11001", "11002", "11003", "11004", "11005", "11006", "11007", "11008", "11009", "11010", "11011", "11012", "11013", "11014", "11015", "11016", "11017", "11018", "11019", "11020", "11021", "11022", "11023", "11024", "11025", "11026", "11027", "11028", "11029", "11030", "11031", "11032", "11033", "11034", "11035", "11036", "11037", "11038", "11039", "11040", "11041", "11042", "11043", "11044", "11045", "11046", "11047", "11048", "11049", "11050", "11051", "11052", "11053", "11054", "11055", "11056", "11057", "11058", "11059", "11060", "11061", "11062", "11063"]#"11064", "11065", "11066", "11067", "11068", "11069", "11070", "11071", "11072", "11073", "11074", "11075", "11076", "11077", "11078", "11079", "11080", "11081", "11082", "11083", "11084", "11085", "11086", "11087", "11088", "11089", "11090", "11091", "11092", "11093", "11094", "11095", "11096", "11097", "11098", "11099", "11100", "11101", "11102", "11103", "11104", "11105", "11106", "11107", "11108", "11109", "11110", "11111", "11112", "11113", "11114", "11115", "11116", "11117", "11118", "11119", "11120", "11121", "11122", "11123", "11124", "11125", "11126", "11127", "11128", "11129", "11130", "11131", "11132", "11133", "11134", "11135", "11136", "11137", "11138", "11139", "11140", "11141", "11142", "11143", "11144"] #"11145", "11146", "11147", "11148", "11149", "11150", "11151", "11152", "11153", "11154", "11155", "11156", "11157", "11158", "11159", "11160", "11161", "11162", "11163", "11164", "11165", "11166", "11167", "11168", "11169", "11170", "11171", "11172", "11173", "11174", "11175", "11176", "11177", "11178", "11179", "11180", "11181", "11182", "11183", "11184", "11185", "11186", "11187", "11188", "11189", "11190", "11191", "11192", "11193", "11194", "11195", "11196", "11197", "11198", "11199", "11200", "11201", "11202", "11203", "11204", "11205", "11206", "11207", "11208", "11209", "11210", "11211", "11212", "11213", "11214", "11215", "11216", "11217", "11218", "11219", "11220", "11221", "11222", "11223", "11224", "11225", "11226", "11227", "11228", "11229", "11230", "11231", "11232", "11233", "11234", "11235", "11236", "11237", "11238", "11239", "11240", "11241", "11242", "11243", "11244", "11245", "11246", "11247", "11248", "11249", "11250", "11251", "11252", "11253", "11254", "11255", "11256", "11257", "11258", "11259", "11260", "11261", "11262", "11263", "11264", "11265", "11266", "11267", "11268", "11269", "11270", "11271", "11272", "11273", "11274", "11275", "11276", "11277", "11278", "11279", "11280", "11281", "11282", "11283", "11284", "11285", "11286", "11287", "11288", "11289", "11290", "11291", "11292", "11293", "11294", "11295", "11296", "11297", "11298", "11299", "11300", "11301", "11302", "11303", "11304", "11305", "11306", "11307", "11308", "11309", "11310", "11311", "11312", "11313", "11314", "11315", "11316", "11317", "11318", "11319", "11320", "11321", "11322", "11323", "11324", "11325", "11326", "11327", "11328", "11329", "11330", "11331", "11332", "11333", "11334", "11335", "11336", "11337", "11338", "11339", "11340", "11341", "11342", "11343", "11344", "11345", "11346", "11347", "11348", "11349", "11350", "11351", "11352", "11353", "11354", "11355", "11356", "11357", "11358", "11359", "11360", "11361", "11362", "11363", "11364", "11365", "11366", "11367", "11368", "11369", "11370", "11371", "11372", "11373", "11374", "11375", "11376", "11377", "11378", "11379", "11380", "11381", "11382", "11383", "11384", "11385", "11386", "11387", "11388", "11389", "11390", "11391", "11392", "11393", "11394", "11395", "11396", "11397", "11398", "11399", "11400", "11401", "11402", "11403", "11404", "11405", "11406", "11407", "11408", "11409", "11410", "11411", "11412", "11413", "11414", "11415", "11416", "11417", "11418", "11419", "11420", "11421", "11422", "11423", "11424", "11425", "11426", "11427", "11428", "11429", "11430", "11431", "11432", "11433", "11434", "11435", "11436", "11437", "11438", "11439", "11440", "11441", "11442", "11443", "11444", "11445", "11446", "11447", "11448", "11449", "11450", "11451", "11452", "11453", "11454", "11455", "11456", "11457", "11458", "11459", "11460", "11461", "11462", "11463", "11464", "11465", "11466", "11467", "11468", "11469", "11470", "11471", "11472", "11473", "11474", "11475", "11476", "11477", "11478", "11479", "11480", "11481", "11482", "11483", "11484", "11485", "11486", "11487", "11488", "11489", "11490", "11491", "11492", "11493", "11494", "11495", "11496", "11497", "11498", "11499"]
  return jsonify(postcodes)

@app.route('/getPeople', methods=['POST'])
def getPeople():
  postCode = request.json['postCode']
  '''database query logic here'''
  people = ['Y35.3', 'Y40.0', 'Y06.2','S80.0','S81.9','S89.9','T35.2','Z41.3']
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