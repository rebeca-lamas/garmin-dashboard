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

d3.csv("../../barchart-all-years.csv", function(d, i, columns) {
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
});
}

createBarChart();