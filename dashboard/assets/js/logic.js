function createWeekHeatmap() {
    const margin = { top: 50, right: 0, bottom: 100, left: 30 },
width = 960 - margin.left - margin.right,
height = 430 - margin.top - margin.bottom,
gridSize = Math.floor(width / 24),
legendElementWidth = gridSize*2,
buckets = 9,
colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

const svg = d3.select("#week-heatmap").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const dayLabels = svg.selectAll(".dayLabel")
.data(days)
.enter().append("text")
.text(function (d) { return d; })
.attr("x", 0)
.attr("y", function (d, i) { return i * gridSize; })
.style("text-anchor", "end")
.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

const timeLabels = svg.selectAll(".timeLabel")
.data(times)
.enter().append("text")
.text(function(d) { return d; })
.attr("x", function(d, i) { return i * gridSize; })
.attr("y", 0)
.style("text-anchor", "middle")
.attr("transform", "translate(" + gridSize / 2 + ", -6)")
.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

const heatmapChart = function(csvFile) {
    d3.csv(csvFile,
    function(d) {
        return {
            day: +d.day,
            hour: +d.hour,
            values: +d.values
        };
    },
    function(error, data) {
        const colorScale = d3.scaleQuantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.values; })])
        .range(colors);
        
        const cards = svg.selectAll(".hour")
        .data(data, function(d) {return d.day+':'+d.hour;});
        
        cards.append("title");
        
        cards.enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d) { return colorScale(d.values); });
        
        cards.select("title").text(function(d) { return d.values; });
        
        cards.exit().remove();
        
        const legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; });

        legend.enter().append("g")
            .attr("class", "legend");

        legend.enter().append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });
        
        legend.enter().append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);
        
        legend.exit().remove();
        console.log('created week heatmap');
    });  
};
const csv = '../../resources/data/day-hour.csv';
heatmapChart(csv); 
}

function createBarChart() {

    const margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 650 - margin.left - margin.right,
    height = 325 - margin.top - margin.bottom;
    
    const svg = d3.select("#bar-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const tooltip = d3.select("body").append("div").attr("class", "toolTip");
    
    const x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);
    
    const x1 = d3.scaleBand()
    .padding(0.05);
    
    const y = d3.scaleLinear()
    .rangeRound([height, 0]);
    
    const z = d3.scaleOrdinal()
    .range(["#f9f3b9", "#38c4bf", "#d28888", "#474ef1", "#a05d56", "#d0743c", "#ff8c00"]);
    
    d3.csv("../../resources/data/barchart-all-years.csv", function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        return d;
    }, function(error, data) {
        if (error) throw error;
        var keys = data.columns.slice(1);
        x0.domain(data.map(function(d) { return d.name; }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
        g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key], name: d.name}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); })
        .on("mousemove", function(d){
            tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d.name) + " " + (d.key) + "<br>" + (d.value) + " workouts");
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});
        
        g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));
        
        g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start");
        
        const legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);
        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
    console.log('created bar chart');
    });
    }
    
    
function createBubbleMap(){
    let activity_type;

    function getColor(d) {
        return d === 'running' ? '#F06C6C':
            d === 'walking' ? '#FF9966':
            d === 'cycling' ? '#F3BA4D':
            d === 'hiking' ? '#F3DB4D':
            d === 'treadmill_running' ? '#E1F34D':
                    '#B7F34D';
    }
    
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    
    const baseMaps = {
        "Street Map": streetmap
    };
    
    const myMap = L.map("bubble-map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap]
      });
      
    const layerControl = L.control.layers(baseMaps, [], {
        collapsed: false
      }).addTo(myMap);
    
    d3.csv('../../resources/data/map-data.csv', data => {
        const runningMarkers = [];
        const walkingMarkers = [];
        const cyclingMarkers = [];
        const hikingMarkers = [];
        const treadmillMarkers = [];
    
        data.forEach(activity => {
            let latitude = activity.start_latitude;
            let longitude = activity.start_longitude;
            let location = [latitude, longitude];
            let duration = activity.total_time;
            let title = activity.title;
            let distance = activity.distance;
            activity_type = activity.activity_type
            
            if (activity_type === 'running'){
                runningMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<h2>${title}</h2><hr></hr><h2>distance: ${distance}</h2><hr></hr><h2>duration (mins): ${duration}</h2>`));
            } else if (activity_type === 'walking'){
                walkingMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<h2>${title}</h2><hr></hr><h2>distance: ${distance}</h2><hr></hr><h2>duration (mins): ${duration}</h2>`));
            } else if (activity_type === 'cycling'){
                cyclingMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<h2>${title}</h2><hr></hr><h2>distance: ${distance}</h2><hr></hr><h2>duration (mins): ${duration}</h2>`));
            } else if (activity_type === 'hiking'){
                hikingMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<h2>${title}</h2><hr></hr><h2>distance: ${distance}</h2><hr></hr><h2>duration (mins): ${duration}</h2>`));
            } else if (activity_type === 'treadmill_running'){
                treadmillMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<h2>${title}</h2><hr></hr><h2>distance: ${distance}</h2><hr></hr><h2>duration (mins): ${duration}</h2>`));
            }
            
        });
        const running = L.layerGroup(runningMarkers);
        const walking = L.layerGroup(walkingMarkers);
        const cycling = L.layerGroup(cyclingMarkers);
        const hiking = L.layerGroup(hikingMarkers);
        const treadmill = L.layerGroup(treadmillMarkers);
    
        layerControl.addOverlay(running, 'Running');
        layerControl.addOverlay(walking, 'Walking');
        layerControl.addOverlay(cycling, 'Cycling');
        layerControl.addOverlay(hiking, 'Hiking');
        layerControl.addOverlay(treadmill, 'Treadmill');
    
    });    
    console.log('created bubble map');
}

function createTable() {
    d3.csv('../../resources/data/beca_activities.csv', data => {
        const thead_tr = d3.select('thead').append('tr');
        const column_names = Object.keys(data[0]);
        column_names.forEach(name => {
            thead_tr.append('th').text(name);
        });
    
        const tbody = d3.select("tbody");    
    
        data.forEach(activity =>{
            const tr = tbody.append("tr");
            Object.entries(activity).forEach(([key, value]) => {
                tr.append("td").text(value);
            });
        });
    });
};

createWeekHeatmap();
createBarChart();
createBubbleMap();
createTable();