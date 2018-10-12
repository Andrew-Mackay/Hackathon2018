var canvas = document.getElementById("thecanvas");

var ctx = canvas.getContext('2d'),
    cx = 150,
    cy = 150,
    radius = 148;

ctx.fillStyle = '#0d6d0c';
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fill();

// create random points
ctx.fillStyle = '#cccccc';



data = [["data1","London"],["data2","Edinburgh"],["data3","London"],["data4","London"],["data5","Glasgow"],["data6","London"]]

var counts = {};
for (var i = 0; i < data.length; i++) {
    counts[data[i][1]] = 1 + (counts[data[i][1]] || 0);
}

console.log(counts);

count = Object.keys(counts).length;

while (count) {
    var x = Math.random() * (canvas.width - 100) + 50;
    var y = Math.random() * (canvas.height - 100) + 50;
    ctx.fillRect(x, y, 20,20);
    count--;
    ctx.fillText(Object.keys(counts)[count],x-5,y-2.5);
}