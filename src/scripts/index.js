import '../styles/index.css';
import { makeWorld, HEIGHT, WIDTH } from './world';
import * as d3 from "d3";

let shapes = [];
let testUnits = [];

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function generateShapes() {
    let shapes = [];
}

function draw() {
    let canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 20, 10);
}

function worldToCanvas(p) {
    return [
        p[0] / HEIGHT * CANVAS_HEIGHT,
        p[1] / WIDTH * CANVAS_WIDTH,
    ];
}

function drawEntity(ctx, entity) {
    if (entity.entityType == 'testUnit') {
        ctx.fillStyle = "#FF0000";
    } else {
        ctx.fillStyle = "#0000FF";
    }
    let startPoint = worldToCanvas(entity.shape.points[0]);
    ctx.beginPath();

    ctx.moveTo(startPoint[0], startPoint[1]);
    for (let i=1; i<entity.shape.points.length; i++) {
        let canvasPoint = worldToCanvas(entity.shape.points[i]);
        ctx.lineTo(canvasPoint[0], canvasPoint[1]);
    }
    ctx.closePath();
    ctx.fill();
}

function drawWorld(world, canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let building of world.buildings) {
        drawEntity(ctx, building);
    }

    for (let testUnit of world.testUnits) {
        drawEntity(ctx, testUnit);
    }
}

function buildTable(data) {
    let parent = document.getElementById("simulation-table");
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    let frequencies = Array(11).fill(0);
    for (let item of data) {
        if (item.structuresSeen < 11) {
            frequencies[item.structuresSeen] += 1;
        }
    }
    let header = document.createElement("tr");
    header.innerHTML = "<th>Buildings Seen</th><th>Frequency</th>";
    tbody.appendChild(header);
    for (let i=0; i<11; i++) {
        let row = document.createElement("tr");
        let countColumn = document.createElement("td");
        countColumn.textContent = i;
        let frequencyColumn = document.createElement("td");
        frequencyColumn.textContent = frequencies[i];
        row.appendChild(countColumn);
        row.appendChild(frequencyColumn);
        tbody.appendChild(row);
    }
    parent.innerHTML = '';
    parent.appendChild(table);

}

function runSimulation(buildingInfo, testUnitInfo, simulationCount) {
    let data = [];
    for (let i=0; i<simulationCount; i++) {
        let world = makeWorld(buildingInfo, testUnitInfo);
        data.push({
            structuresSeen: world.structuresSeen()
        });
    }
    buildTable(data);
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#histogram")
        .html("")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // X axis: scale and draw:
    var x = d3.scaleLinear()
        .domain([0, 10])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.structuresSeen; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(10)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2");

}


function init() {
    let world;
    let canvas = document.getElementById("canvas");
    let structuresSeenOutput = document.getElementById("structures-seen-output");

    function regenerateFromInputs() {
        world = makeWorld(getBuildingInfo(), getTestUnitInfo());
        drawWorld(world, canvas);
        structuresSeenOutput.innerText = world.structuresSeen();
    }

    function initializeInput(inputId, defaultValue) {
        let input = document.getElementById(inputId);
        input.value = defaultValue;
        input.addEventListener("change", regenerateFromInputs);
        return input;
    }

    function getBuildingInfo() {
        return {
            count: parseInt(buildingCountInput.value, 10),
            width: parseFloat(buildingWidthInput.value),
            height: parseFloat(buildingHeightInput.value),
        };
    }

    function getTestUnitInfo() {
        return {
            count: parseInt(testUnitCountInput.value, 10),
            width: parseFloat(testUnitWidthInput.value),
            height: parseFloat(testUnitHeightInput.value),
            lockRotation: testUnitLockRotationInput.checked,
        };
    }

    let buildingCountInput = initializeInput("building-count-input", 10);
    let buildingWidthInput = initializeInput("building-width-input", 4);
    let buildingHeightInput = initializeInput("building-height-input", 3);
    let testUnitCountInput = initializeInput("test-unit-count-input", 5);
    let testUnitWidthInput = initializeInput("test-unit-width-input", 4);
    let testUnitHeightInput = initializeInput("test-unit-height-input", 4);
    let testUnitLockRotationInput = document.getElementById("test-unit-lock-rotation-input");
    let simulationCountInput = document.getElementById("simulation-count-input");
    let regenerateButton = document.getElementById("regenerate-button");
    regenerateButton.addEventListener("click", regenerateFromInputs);
    let simulateButton = document.getElementById("simulate-button");
    simulateButton.addEventListener("click", () => {
        runSimulation(getBuildingInfo(), getTestUnitInfo(), simulationCountInput.value);
    });
}

window.addEventListener("load", init);