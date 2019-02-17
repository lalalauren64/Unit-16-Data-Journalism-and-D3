// @TODO: YOUR CODE HERE!
// Set chart area

var svgWidth = 960;
var svgHeight = 500;

// Set margins for my chart

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// 3.) Creating SVG wrapper, and adding an SVG group that will hold the chart.  
//     The chart will shift by the left and top margins.

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// 5.) I am setting the initial parameter

var chosenXAxis = "poverty";

// 6.) Creating the function used for updating the x-scale variable by clicking on the axis label.
//     The label will include scales.

function xScale(data, axes) {
  // create scales
    var scale = d3.scaleLinear()
        .domain([d3.min(data, d => d[axes]) * 0.8,
            d3.max(data, d => d[axes]) * 1.2
        ])
        .range([0, width]);
        return scale;    
}

// 7.) Create a function used for updating xAxis var upon click on axis label.

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;    
}

// 8.) Create a function for updating circles group with a transition to new circles.

function renderCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

return circlesGroup;
}

// 9.) Creating a function to update the circles group with a new tooltip

function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
        var label = "In Poverty (%)";
    }

    else if (chosenXAxis === "age") {
        var label = "Age (Median)";
    }

    else {
        var label = "Household Income";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
    // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
   return circlesGroup;
}

// 10.) I am retrieving data from CSV file and executing it.

d3.csv("data.csv", function(err, healthData) {
    if (err) throw err;

// 11.) I am parsing the data.

healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.healthcare = +data.healthcare;

});

// 12.) Setting the xLinearScale function from the data csv import.

var xLinearScale = xScale(healthData, chosenXAxis);
console.log("this is xLinearScale", xLinearScale)

// 13.) I am creating a y scale function.
// This is the initial parameter for the y axis.

var chosenYAxis = "obesity";

function yScale(data, axes) {
    var scale = d3.scaleLinear()
        .domain([d3.min(data, d => d[axes]) * 0.8,
            d3.max(data, d => d[axes]) * 1.2
        ])
        .range([0, width]);

    return scale; 
}

function renderAxes(newYScale, YAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    YAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return YAxis;
}

function renderCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Creating a function to update the circles group with a new tooltip

function updateToolTip(chosenYAxis, circlesGroup) {

    if (chosenYAxis === "obesity") {
        var label = "Obese (%)";
    }

    
function updateToolTip(chosenYAxis, circlesGroup) {

    if (chosenYAxis === "obesity") {
        var label = "Obese (%)";
    }

    else if (chosenYAxis === "smokes") {
        var label = "Smokes (%)";
    }

    else {
        var label = "Lacks Healthcare (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.abbr}<br>${label} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// 14.) I am creating inital axis functions

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// 15.) I am appending x axis

var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("trasform", `translate(0, ${height})`)
    .call(bottomAxis);

// 16.) I am appending y axis

chartGroup.append("g")
    .call(leftAxis);

// 17.) I am appending initial circles

var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

// 18.) I am creating a group for 3 x-axis labels

var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");

var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("active", true)
    .text("Age (Median)");

var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)");

// 19.) I am creating a group for 3 y-axis labels

// 20.) I am appending y axis

// 21.) I am updating ToolTip function from data csv import

var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// 22.) I am adding a x axis labels event listener

labelsGroup.selectAll("text")
    .on("click", function () {

        // I am getting value of selection 

        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replacing chosenXAxis with value

            chosenXAxis = value;

            // updating x scale for new data

            xLinearScale = xScale(healthData, chosenXAxis);

            // updating x axis with tranistion

            xAxis = renderAxes(xLinearScale, xAxis);

            // updating circles with new x values

            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updating tooltips with new info

            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

           if (chosenXAxis === "poverty") {
               povertyLabel
                .classed("active", true)
                .classed("inactive", false);
               ageLabel
                .classed("active", false)
                .classed("inactive", true);
               incomeLabel
                .classed("active", false)
                .classed("inactive", true);
           } 

           else if (chosenXAxis === "age") {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
           }

           else{
               incomeLabel
                .classed("active", true)
                .classed("inactive", false);
               povertyLabel
                .classed("active", false)
                .classed("inactive", true);
               ageLabel
                .classed("active", false)
                .classed("inactive", true);
           }
        }
    });
});