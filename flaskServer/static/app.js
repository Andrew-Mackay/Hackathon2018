import { getCities } from './api.js';

let renderingPeople = false;
let direction = -1;

function setup() {
  createCanvas(720, 400);
  background(150, 150, 150);
  for (var i = 0; i < num; i++) {
    ax[i] = width / 2;
    ay[i] = height / 2;
  }

  getCities().then((data) => {
    // let data = ["London", "Edinburgh", "Glasgow", "Aberdeen", "York"];
    renderCities(data);
    console.log(data)
  })


}

function createCity(name) {
  this.x = random(width - 20);
  this.y = random(height - 20);
  this.diameter = 20;
  rect(this.x, this.y, this.diameter, this.diameter);
  text(name, this.x, this.y);
  return [x, y];
}

function renderCities(data) {
  count = data.length;

  points = {};
  while (count) {
    var text = data[count - 1];
    points[text] = createCity(text);
    count--;
  }
}

function renderPeople() {
  renderingPeople = true;
}

var num = 2;
var range = 4;

var ax = [];
var ay = [];

function draw() {
  if (renderingPeople) {
    background(150, 150, 150);

    // Shift all elements 1 place to the left
    for (var i = 1; i < num; i++) {
      ax[i - 1] = ax[i];
      ay[i - 1] = ay[i];
    }

    // Put a new value at the end of the array
    ax[num - 1] += random(-range, range);
    ay[num - 1] += random(-range, range);

    // Constrain all points to the screen
    ax[num - 1] = constrain(ax[num - 1], 0, width);
    ay[num - 1] = constrain(ay[num - 1], 0, height);

    for (var j = 1; j < num; j++) {
      ellipse(ax[j], ay[j], 24, 24);
    }
  }
}

function mousePressed() {
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
          data = [
            "12345",
            "28749",
            "29573",
            "20958",
            "98738",
            "46382",
            "74847",
            "13337",
            "37489",
            "57585",
            "12095"
          ];
          background(150, 150, 150);
          renderCities(data);
        } else {
          renderPeople();
        }
      }
    }
  });


}