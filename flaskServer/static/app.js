let renderingPeople = false;
let renderingPostcodes = false;
let renderingCities = false;
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
let cityName = "";

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

  cityName = location.search.split("city=")[1];
  getPostcodes(cityName)
    .then(({ data }) => {
      renderingCities = false;
      renderingPostcodes = true;
      //background(150, 150, 150);
      renderPostcodes(data);
    })
    .catch(function(error) {});
  // getCities()
  //   .then(({ data }) => {
  //     data = data;
  //     renderCities(data);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });
  //noLoop();
}

// function createCity(name, latLng) {
//   // this.x = ((MAP_WIDTH/360.0) * (180 + latLng[1]))
//   // this.y = ((MAP_HEIGHT/180.0) * (90 - latLng[0]))
//   this.x = latLng[0] * MAP_WIDTH
//   this.y = latLng[1] * MAP_HEIGHT
//   this.diameter = 10;
//   return [x, y];
// }

// function renderCities(data) {
//   count = Object.keys(data).length;
//   while (count) {
//     var text = Object.keys(data)[count - 1];
//     cities[text] = createCity(text, data[text]);
//     count--;
//   }
// }

function createPostcode(name, count) {
  this.x = postcodeWidth - (count + 1) * 150;
  this.y = random(1);
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

var createPerson = async function(count, first, last, drg) {
  this.x = (count + 1) * 200;
  this.y = (count + 1) * 20 + 20;
  this.diameter = 20;
  illnesses = "";
  Object.values(drg.split(",")).map(function(drgcode, index) {
    getDrg(drgcode)
      .then(({ data }) => {
        console.log(data);
        illnesses += data + " & a";
      })
      .catch(function(error) {
        illnesses += "unknown illness" + " & a";
      });
  });

  console.log(illnesses);
  return [x, y, first + " " + last, illnesses];
};

function renderPeople(data) {
  //console.log(data);
  count = data.length;

  while (count) {
    var account = data[count - 1].AccountNumber;
    var first = data[count - 1].FirstName;
    var last = data[count - 1].LastName;
    var admissions = data[count - 1].admissions;
    var drg = [];

    Object.values(admissions).map(function(objectValue, index) {
      drg += objectValue.Drg + ",";
    });
    drg = drg.slice(0, -1);

    people[account] = createPerson(count, first, last, drg);
    console.log(people);
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

      /*
      if (
        illness[Object.keys(people).find(key => people[key] === objectValue)] ==
          undefined ||
        illness[Object.keys(people).find(key => people[key] === objectValue)] ==
          ""
      ) {
        illnesses = "";
        Object.values(objectValue[3].split(",")).map(function(drgcode, index) {
          getDrg(drgcode)
            .then(({ data }) => {
              console.log(data);
              illnesses += data + " & a";
            })
            .catch(function(error) {
              illnesses += "unknown illness" + " & a";
            });
        });
        illness[
          Object.keys(people).find(key => people[key] === objectValue)
        ] = illnesses;
        console.log(illnesses);
      }*/

      text(
        "I am suffering from a " +
          illness[Object.keys(people).find(key => people[key] === objectValue)],
        objectValue[0],
        objectValue[1]
      );
      text(objectValue[2], objectValue[0], objectValue[1] + 300);
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
          // getPostcodes("CityName")
          //   .then(({ data }) => {
          //     renderingCities = false;
          //     renderingPostcodes = true;
          //     //background(150, 150, 150);
          //     renderPostcodes(data);
          //   })
          //   .catch(function(error) {
          //     console.log(error);
          //   });
        } else {
          getPeople(
            Object.keys(points).find(key => points[key] === objectValue),
            cityName
          )
            .then(({ data }) => {
              renderingPostcodes = false;
              renderingPeople = true;
              //background(150, 150, 150);
              renderPeople(data);
            })
            .catch(function(error) {});
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

function getPeople(postCode, cityName) {
  return axios.post(BASE_URL + "getPeople", {
    postCode: postCode,
    cityName: cityName
  });
}

async function getDrg(drgCode) {
  return awaitaxios.post(BASE_URL + "getDrg", { drgCode: drgCode });
}
