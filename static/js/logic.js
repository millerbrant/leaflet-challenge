const API_KEY = "pk.eyJ1IjoibWlsbGVyYnJhbnQiLCJhIjoiY2ticjFvMGZ3MG5ydzMya2EwbmdlbTNtYyJ9.QIJJtwfgnu11nIKdxybB9g";

// Initial values
var magval = d3.select("#magsel").on("change",masterControl);
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
console.log("prerun mag val is "+ magval)

//Initial map
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    });

    var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlsbGVyYnJhbnQiLCJhIjoiY2ticjFvMGZ3MG5ydzMya2EwbmdlbTNtYyJ9.QIJJtwfgnu11nIKdxybB9g', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  }).addTo(myMap); // addTo() is required to throw layers onto map
  
    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlsbGVyYnJhbnQiLCJhIjoiY2ticjFvMGZ3MG5ydzMya2EwbmdlbTNtYyJ9.QIJJtwfgnu11nIKdxybB9g', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/dark-v9',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: API_KEY
  }).addTo(myMap); // addTo() is required to throw layers onto map

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

// Create a layer control
  L.control.layers(baseMaps).addTo(myMap);

// Full data pull fired on dropdown change
function masterControl(){
console.log("Game grid activated")

// Remove existing circles
d3.selectAll(".leaflet-interactive").remove()

// Selects correct JSON URL based on drop-down selection
url = dataSelect(d3.select("#magsel").property("value"))
console.log("target url: "+url)

// Get data from URL
d3.json(url, function(data) {
    console.log("json selection is: "+d3.select("#magsel").property("value"))

  // Send JSON data to feature creation
  createFeatures(data.features);
})};


// Initial breakout of JSON data
function createFeatures(earthquakeData) {
  console.log('create features called')

  // Pulls lat/long and place/time info for circles and popups
  function onEachFeature(feature, layer) {
    // Set opacity based on magnitude
    var colorval = 1-(1/feature.properties.mag)

    // Sets color based on magnitude
    var fColor = "";
    if(feature.properties.mag>=7){
        fColor = "red"
    } else if(feature.properties.mag>6){
        var fColor = "purple"
    } else if(feature.properties.mag>5.5){
        var fColor = "blue"
    } else var fColor = "green";

    // Creates circles and adds to maps
      L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        fillOpacity: 1-(1/feature.properties.mag),
        color:fColor,
        fillColor: fColor,
        radius: feature.properties.mag*15000}).bindPopup("<h3>" + feature.properties.place + "</h3><hr>"+"<h4> Magnitude:"+feature.properties.mag+"</h4><hr><p>" + new Date(feature.properties.time) + "</p>").on('click', clickZoom).addTo(myMap);
    }

  // geoJSON features layer creation
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
createMap(earthquakes);

  

function createMap(earthquakes) {
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  }};

}


// Selects URL based on drop-down value
function dataSelect(mag){
  console.log("dataSelect called, magVal is "+mag)
  if(mag==="All"){console.log("All selected")
    magURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  }
  else if(mag==="4.5+"){console.log("4.5+ selected")
    magURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
  }
  else if(mag==="2.5+"){console.log("2.5+ selected")
    magURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
  }
  else if(mag==="1+"){console.log("1+ selected")
    magURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
  }
  console.log(magURL)
  return magURL
}

//Initial call to populate map
masterControl()

// shoutout to stackoverflow for this function, all I changed was the zoom level (and added a console event for QA)
function clickZoom(e) {
    console.log("clickzoom called")
	myMap.setView(e.target.getLatLng(),5);
}
