// weekly heat  map

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

  d3.json("/api/weekly",
    function(data) {
      // console.log(data);
      let dict = data.map(function(d) { return {'day': d[0], 'hour': d[1], 'values': d[2]}});
      console.log(dict);
      const colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, d3.max(dict, function (d) { return d.values; })])
      .range(colors);
      
      const cards = svg.selectAll(".hour")
      .data(dict, function(d) {return d.day+':'+d.hour;});
      
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
      
      cards.select("title").text(function(data) { return d.values; });
      
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

// Bar chart/histo
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
  .range(["#FFE599", "#38c4bf", "#d28888", "#474ef1", "#a05d56", "#d0743c", "#ff8c00"]);
  
  d3.json("/api/barchart", function(data) {
      let dict = data.map(function(d) { return {'name': d[0], '2016': d[1], '2017': d[2], '2018': d[3], '2019': d[4]}});
      // console.log(data);
      // console.log(dict);
      let keys = Object.keys(dict[0]).slice(0,-1);
      // console.log(keys);

      x0.domain(dict.map(function (d) { return d.name; }));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(dict, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();

      g.append("g")
          .selectAll("g")
          .data(dict)
          .enter().append("g")
          .attr("transform", function (d) { return "translate(" + x0(d.name) + ",0)"; })
          .selectAll("rect")
          .data(function (d) { 
          return keys.map(function (key) { 
            return { key: key, value: d[key]}; 
             }); 
           })
          .enter().append("rect")
          .attr("x", function (d) { return x1(d.key); })
          .attr("y", function (d) { return y(d.value); })
          .attr("width", x1.bandwidth())
          .attr("height", function (d) { return height - y(d.value); })
          .attr("fill", function (d) { return z(d.key); })
          .on("mouseover", function(d){
              tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.value) + " workouts");
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
      
      var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys.slice().reverse())
          .enter().append("g")
          .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", z);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function (d) { return d; });
  });
  console.log('created bar chart');
};
    // Map
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
    
    d3.json('/api/map', function(data) {
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
                    }).bindPopup(`<p>${title}</p><hr></hr><p>distance: ${distance}</p><hr></hr><p>duration (mins): ${duration}</p>`));
            } else if (activity_type === 'walking'){
                walkingMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<p>${title}</p><hr></hr><p>distance: ${distance}</p><hr></hr><p>duration (mins): ${duration}</p>`));
            } else if (activity_type === 'cycling'){
                cyclingMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<p>${title}</p><hr></hr><p>distance: ${distance}</p><hr></hr><p>duration (mins): ${duration}</p>`));
            } else if (activity_type === 'hiking'){
                hikingMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<p>${title}</p><hr></hr><p>distance: ${distance}</p><hr></hr><p>duration (mins): ${duration}</p>`));
            } else if (activity_type === 'treadmill_running'){
                treadmillMarkers.push(
                    L.circle(location, {
                        color: '#000',
                        fillColor: getColor(activity_type),
                        fillOpacity: 0.85,
                        radius: duration *500
                    }).bindPopup(`<p>${title}</p><hr></hr><p>distance: ${distance}</p><hr></hr><p>duration (mins): ${duration}</p>`));
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
};
// table
function createTable() {
   
  d3.json('/api/activities', function(data) {
        const thead_tr = d3.select('thead').append('tr');
        // console.log(data);
        const column_names = ["Activity Type", "Date", "Title", "Distance", "Calories", "Duration", "Average HR", 
          "Max HR", "Average Pace", "Best Pace", "Steps", "Start Latitude", "Start Longitude"];
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
  console.log('created table');
};

function animation(){
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");
    var cH;
    var cW;
    var bgColor = "#FF6138";
    var animations = [];
    var circles = [];
    
    var colorPicker = (function() {
      var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
      var index = 0;
      function next() {
        index = index++ < colors.length-1 ? index : 0;
        return colors[index];
      }
      function current() {
        return colors[index]
      }
      return {
        next: next,
        current: current
      }
    })();
    
    function removeAnimation(animation) {
      var index = animations.indexOf(animation);
      if (index > -1) animations.splice(index, 1);
    }
    
    function calcPageFillRadius(x, y) {
      var l = Math.max(x - 0, cW - x);
      var h = Math.max(y - 0, cH - y);
      return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
    }
    
    function addClickListeners() {
      document.addEventListener("touchstart", handleEvent);
      document.addEventListener("mousedown", handleEvent);
    };
    
    function handleEvent(e) {
        if (e.touches) { 
          e.preventDefault();
          e = e.touches[0];
        }
        var currentColor = colorPicker.current();
        var nextColor = colorPicker.next();
        var targetR = calcPageFillRadius(e.pageX, e.pageY);
        var rippleSize = Math.min(200, (cW * .4));
        var minCoverDuration = 750;
        
        var pageFill = new Circle({
          x: e.pageX,
          y: e.pageY,
          r: 0,
          fill: nextColor
        });
        var fillAnimation = anime({
          targets: pageFill,
          r: targetR,
          duration:  Math.max(targetR / 2 , minCoverDuration ),
          easing: "easeOutQuart",
          complete: function(){
            bgColor = pageFill.fill;
            removeAnimation(fillAnimation);
          }
        });
        
        var ripple = new Circle({
          x: e.pageX,
          y: e.pageY,
          r: 0,
          fill: currentColor,
          stroke: {
            width: 3,
            color: currentColor
          },
          opacity: 1
        });
        var rippleAnimation = anime({
          targets: ripple,
          r: rippleSize,
          opacity: 0,
          easing: "easeOutExpo",
          duration: 900,
          complete: removeAnimation
        });
        
        var particles = [];
        for (var i=0; i<32; i++) {
          var particle = new Circle({
            x: e.pageX,
            y: e.pageY,
            fill: currentColor,
            r: anime.random(24, 48)
          })
          particles.push(particle);
        }
        var particlesAnimation = anime({
          targets: particles,
          x: function(particle){
            return particle.x + anime.random(rippleSize, -rippleSize);
          },
          y: function(particle){
            return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
          },
          r: 0,
          easing: "easeOutExpo",
          duration: anime.random(1000,1300),
          complete: removeAnimation
        });
        animations.push(fillAnimation, rippleAnimation, particlesAnimation);
    }
    
    function extend(a, b){
      for(var key in b) {
        if(b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    }
    
    var Circle = function(opts) {
      extend(this, opts);
    }
    
    Circle.prototype.draw = function() {
      ctx.globalAlpha = this.opacity || 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      if (this.stroke) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }
      ctx.closePath();
      ctx.globalAlpha = 1;
    }
    
    var animate = anime({
      duration: Infinity,
      update: function() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cW, cH);
        animations.forEach(function(anim) {
          anim.animatables.forEach(function(animatable) {
            animatable.target.draw();
          });
        });
      }
    });
    
    var resizeCanvas = function() {
      cW = window.innerWidth;
      cH = window.innerHeight;
      c.width = cW * devicePixelRatio;
      c.height = cH * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    
    (function init() {
      resizeCanvas();
      if (window.CP) {

        window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
      }
      window.addEventListener("resize", resizeCanvas);
      addClickListeners();
      if (!!window.location.pathname.match(/fullcpgrid/)) {
        startFauxClicking();
      }
      handleInactiveUser();
    })();
    
    function handleInactiveUser() {
      var inactive = setTimeout(function(){
        fauxClick(cW/2, cH/2);
      }, 2000);
      
      function clearInactiveTimeout() {
        clearTimeout(inactive);
        document.removeEventListener("mousedown", clearInactiveTimeout);
        document.removeEventListener("touchstart", clearInactiveTimeout);
      }
      
      document.addEventListener("mousedown", clearInactiveTimeout);
      document.addEventListener("touchstart", clearInactiveTimeout);
    }
    
    function startFauxClicking() {
      setTimeout(function(){
        fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
        startFauxClicking();
      }, anime.random(200, 900));
    }
    
    function fauxClick(x, y) {
      var fauxClick = new Event("mousedown");
      fauxClick.pageX = x;
      fauxClick.pageY = y;
      document.dispatchEvent(fauxClick);
    }
};

createWeekHeatmap();
createBarChart();
// createBubbleMap();
createTable();
animation();