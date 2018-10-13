var canvas = document.getElementById("thecanvas");

canvas.addEventListener("click", getPointClicked, false);

function getPointClicked(ev) {
  var x = ev.clientX - canvas.offsetLeft;
  var y = ev.clientY - canvas.offsetTop;

  Object.keys(points).map(function(objectKey, index) {
    if (
      x >= parseInt(objectKey.split(",")[0]) &&
      x <= parseInt(objectKey.split(",")[0]) + 20
    ) {
      if (
        y >= parseInt(objectKey.split(",")[1]) &&
        y <= parseInt(objectKey.split(",")[1]) + 20
      ) {
        console.log(points[objectKey]);
        return points[objectKey];
      }
    }
  });
}

var ctx = canvas.getContext("2d"),
  cx = 150,
  cy = 150,
  radius = 148;

function clearCanvas() {
  ctx.fillStyle = "#0d6d0c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}

function renderCities() {
  data = ["London", "Edinburgh", "Glasgow", "Aberdeen", "York"];
  clearCanvas();

  count = data.length;

  ctx.fillStyle = "#cccccc";
  while (count) {
    var x = Math.random() * (canvas.width - 100) + 50;
    var y = Math.random() * (canvas.height - 100) + 50;
    ctx.fillRect(x, y, 20, 20);
    count--;
    var text = data[count];
    ctx.fillText(text, x - text.length, y - 2.5);

    points[[x, y]] = text;
  }
}

let points = {};

function renderPostcodes(city) {}

function renderPeople(postcode) {}

renderCities();
