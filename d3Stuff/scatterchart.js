data = [["data1","London"],["data2","Edinburgh"],["data3","London"]]

function getPoints(data){

    var counts = {};
    for (var i = 0; i < data.length; i++) {
        counts[data[i][1]] = 1 + (counts[data[i][1]] || 0);
    }
    console.log(counts);



    var points = [[5,3], [10,17], [15,4], [2,8], [2,4], [4,19]];

    return points;
}


points = getPoints(data);

//data = [[data1,London],[data2,Edinburgh],[data3,London]]
   
var margin = {top: 20, right: 15, bottom: 60, left: 60}
    , width = 960 - margin.left - margin.right
    , height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
            .domain([0, d3.max(points, function(d) { return d[0]; })])
            .range([ 0, width ]);

var y = d3.scale.linear()
            .domain([0, d3.max(points, function(d) { return d[1]; })])
            .range([ height, 0 ]);

var chart = d3.select('body')
.append('svg:svg')
.attr('width', width + margin.right + margin.left)
.attr('height', height + margin.top + margin.bottom)
.attr('class', 'chart')

var main = chart.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
.attr('width', width)
.attr('height', height)
.attr('class', 'main')   

/*
// draw the x axis
var xAxis = d3.svg.axis()
.scale(x)
.orient('bottom');

main.append('g')
.attr('transform', 'translate(0,' + height + ')')
.attr('class', 'main axis date')
.call(xAxis);

// draw the y axis
var yAxis = d3.svg.axis()
.scale(y)
.orient('left');

main.append('g')
.attr('transform', 'translate(0,0)')
.attr('class', 'main axis date')
.call(yAxis);

*/

var g = main.append("svg:g"); 

g.selectAll("scatter-dots")
    .data(points)
    .enter().append("svg:circle")
        .attr("cx", function (d,i) { return x(d[0]); } )
        .attr("cy", function (d) { return y(d[1]); } )
        .attr("r", 8);