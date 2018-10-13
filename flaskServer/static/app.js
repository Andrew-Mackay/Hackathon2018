let renderingPeople = false;
let renderingPostcodes = false;
let renderingCities = true;
let direction = -1;
var back;
var bg;
var bg2;
var cityImg;
var postcodeImg;
var font;
let data = [];
let cities = {};
let postcodes = {};

function setup() {
  bg = loadImage("static/resources/map.jpg");
  back = bg;
  bg2 = loadImage("static/resources/road.jpg");
  cityImg = loadImage("static/resources/city.png");
  postcodeImg = loadImage("static/resources/postcode.png");
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

function createCity(name) {
  this.x = random(width - 20);
  this.y = random(height - 20);
  this.diameter = 50;
  return [x, y];
}

function renderCities(data) {
  count = data.length;

  while (count) {
    var text = data[count - 1];
    cities[text] = createCity(text);
    count--;
  }
}

function createPostcode(name) {
  this.x = random(10000 - 20);
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

  while (count) {
    var text = data[count - 1];
    postcodes[text] = createPostcode(text);
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
    createCanvas(10000, windowHeight);
  }
  if (renderingPeople) {
    createCanvas(windowWidth, 10000);
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
    //background(150, 150, 150);

    // Shift all elements 1 place to the left
    for (var i = 1; i < num; i++) {
      ax[i - 1] = ax[i];
      ay[i - 1] = ay[i];
    }

    // Put a new value at the end of the array
    ax[num - 1] += random(-range, range);
    ay[num - 1] += random(-range, range);

    // Constrain all cities to the screen
    ax[num - 1] = constrain(ax[num - 1], 0, width);
    ay[num - 1] = constrain(ay[num - 1], 0, height);

    for (var j = 1; j < num; j++) {
      ellipse(ax[j], ay[j], 24, 24);
    }
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
          renderingPostcodes = false;
          renderingPeople = true;
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
