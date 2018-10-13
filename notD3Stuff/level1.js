var canvas = document.getElementById("thecanvas");

canvas.addEventListener("click", getPointClicked, false);

function getPointClicked(ev) {
  var x = ev.clientX - canvas.offsetLeft;
  var y = ev.clientY - canvas.offsetTop;

  Object.keys(points).map(function(objectKey, index) {
    if (
      x >= parseInt(objectKey.split(",")[0]) &&
      x <= parseInt(objectKey.split(",")[0]) + size
    ) {
      if (
        y >= parseInt(objectKey.split(",")[1]) &&
        y <= parseInt(objectKey.split(",")[1]) + size
      ) {
        console.log(points[objectKey]);
        if (isNaN(points[objectKey])) {
          renderCities(data, "#cccccc", "#666666");
        } else {
          renderPeople();
        }
        return points[objectKey];
      }
    }
  });
}

var ctx = canvas.getContext("2d"),
  cx = 150,
  cy = 150,
  radius = 148;

function clearCanvas(hex) {
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}

function renderCities(data, back, fore) {
  clearCanvas(back);

  count = data.length;

  ctx.fillStyle = fore;
  while (count) {
    var x = Math.random() * (canvas.width - size);
    var y = Math.random() * (canvas.height - size);
    ctx.fillRect(x, y, size, size);
    count--;
    var text = data[count];
    ctx.fillText(text, x - text.length, y - 2.5);

    points[[x, y]] = text;
  }
}

let points = {};

function renderPostcodes(city) {}

function renderPeople() {
  clearCanvas("#666666");
  data = ["Person1", "Person2", "Person3", "Person4"];
  count = data.length;
  while (count) {
    count--;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Where is the circle
  var x, y;

  function setup() {
    createCanvas(720, 400);
    // Starts in the middle
    x = width / 2;
    y = height;
  }

  function draw() {
    background(200);

    // Draw a circle
    stroke(50);
    fill(100);
    ellipse(x, y, 24, 24);

    // Jiggling randomly on the horizontal axis
    x = x + random(-1, 1);
    // Moving up at a constant speed
    y = y - 1;

    // Reset to the bottom
    if (y < 0) {
      y = height;
    }
  }
}

let size = 20;
data = ["London", "Edinburgh", "Glasgow", "Aberdeen", "York"];
renderCities(data, "#0d6d0c", "#cccccc");

size = 100;
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
