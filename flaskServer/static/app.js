let renderingPeople = false;
let renderingPostcodes = false;
let renderingCities = true;
let xp = 0;
let yp = 0;
var back;
var bg;
var bg2;
var cityImg;
var postcodeImg;
var personImg;
var font;
let data = [];
let cities = {};
let postcodes = {};
let people = {};
let illness = {};
let postcodeWidth = 0;

function setup() {
  bg = loadImage("static/resources/map.jpg");
  back = bg;
  bg2 = loadImage("static/resources/road.jpg");
  cityImg = loadImage("static/resources/city.png");
  postcodeImg = loadImage("static/resources/postcode.png");
  personImg = loadImage("static/resources/person.png");
  font = loadFont("static/resources/IndieFlower.ttf");
  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < num; i++) {
    ax[i] = width / 2;
    ay[i] = height / 2;
  }

  getCities()
    .then(({ data }) => {
      data = data;
      renderCities(data);
    })
    .catch(function(error) {
      console.log(error);
    });
  //noLoop();
}

function createCity(name, latLng) {
  this.x = 25 * latLng[0];
  this.y = -latLng[1];
  this.diameter = 20;
  return [x, y];
}

function renderCities(data) {
  count = Object.keys(data).length;

  while (count) {
    var text = Object.keys(data)[count - 1];
    cities[text] = createCity(text, data[text]);
    count--;
  }
}

function createPostcode(name, count) {
  this.x = postcodeWidth - (count + 1) * 150;
  this.y = random(1);
  console.log(this.y);
  if (this.y > 0.5) {
    this.y = 50;
  } else {
    this.y = height - 220;
  }
  this.diameter = 20;
  return [x, y];
}

function renderPostcodes(data) {
  count = data.length;

  postcodeWidth = data.length * 150;

  while (count) {
    var text = data[count - 1];
    postcodes[text] = createPostcode(text, count);
    count--;
  }
}

function createPerson(name, count) {
  this.x = (count + 1) * 200;
  this.y = (count + 1) * 20 + 20;
  this.diameter = 20;
  return [x, y];
}

function renderPeople(data) {
  count = data.length;

  while (count) {
    var text = data[count - 1];
    people[text] = createPerson(text, count);
    count--;
  }
}

var num = 2;
var range = 4;

var ax = [];
var ay = [];

function draw() {
  if (renderingCities) {
    createCanvas(windowWidth, windowHeight);
  }
  if (renderingPostcodes) {
    createCanvas(postcodeWidth, windowHeight);
  }
  if (renderingPeople) {
    createCanvas(windowWidth * 2, windowHeight * 2);
  }

  background(back);

  if (renderingCities) {
    back = bg;
    Object.values(cities).map(function(objectValue, index) {
      image(cityImg, objectValue[0], objectValue[1], 50, 50);
      textFont(font);
      textSize(20);
      text(
        Object.keys(cities).find(key => cities[key] === objectValue),
        objectValue[0],
        objectValue[1]
      );
    });
  }

  if (renderingPostcodes) {
    back = bg2;
    Object.values(postcodes).map(function(objectValue, index) {
      image(postcodeImg, objectValue[0], objectValue[1], 100, 200);
      textFont(font);
      textSize(20);
      text(
        Object.keys(postcodes).find(key => postcodes[key] === objectValue),
        objectValue[0],
        objectValue[1]
      );
    });
  }

  if (renderingPeople) {
    Object.values(people).map(function(objectValue, index) {
      image(personImg, objectValue[0], objectValue[1], 150, 300);
      if (
        illness[Object.keys(people).find(key => people[key] === objectValue)] ==
        undefined
      ) {
        getDrg(Object.keys(people).find(key => people[key] === objectValue))
          .then(({ data }) => {
            illness[
              Object.keys(people).find(key => people[key] === objectValue)
            ] = data;
          })
          .catch(function(error) {
            illness[
              Object.keys(people).find(key => people[key] === objectValue)
            ] = "unknown illness";
            console.log(error);
          });
      }

      text(
        "I am suffering from a " +
          illness[Object.keys(people).find(key => people[key] === objectValue)],
        objectValue[0],
        objectValue[1]
      );
    });
  }
}

function mousePressed() {
  var points = {};
  if (renderingCities) {
    points = cities;
  } else if (renderingPostcodes) {
    points = postcodes;
  }
  Object.values(points).map(function(objectValue, index) {
    if (
      mouseX >= parseInt(objectValue[0]) &&
      mouseX <= parseInt(objectValue[0]) + 20
    ) {
      if (
        mouseY >= parseInt(objectValue[1]) &&
        mouseY <= parseInt(objectValue[1]) + 20
      ) {
        if (
          isNaN(Object.keys(points).find(key => points[key] === objectValue))
        ) {
          getPostcodes("CityName")
            .then(({ data }) => {
              renderingCities = false;
              renderingPostcodes = true;
              //background(150, 150, 150);
              renderPostcodes(data);
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          getPeople("Postcode")
            .then(({ data }) => {
              renderingPostcodes = false;
              renderingPeople = true;
              //background(150, 150, 150);
              renderPeople(data);
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    }
  });
}

//----------------------------------------------

BASE_URL = "http://127.0.0.1:5000/";

function getCities() {
  return axios.get(BASE_URL + "getCities");
}

function getPostcodes(cityName) {
  return axios.post(BASE_URL + "getPostcodes", { cityName: cityName });
}

function getPeople(postCode) {
  return axios.post(BASE_URL + "getPeople", { postCode: postCode });
}

function getDrg(drgCode) {
  return axios.post(BASE_URL + "getDrg", { drgCode: drgCode });
}
