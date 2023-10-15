// Perform a GET request to the query URL
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function(data) {
  // Once we get a response, send the data.features object to the createEQVisualization function
  createEQVisualization(data.features);
});

function createEQVisualization(earthquakeData) {
    // Creating the map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
    });

    // Adding a tile layer (the background map image) to our map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(myMap);

    // Looping through the data to create earthquake markers and popups
    earthquakeData.forEach(feature => {
        var coordinates = feature.geometry.coordinates;
        var magnitude = feature.properties.mag;
        var depth = coordinates[2];
        
        // Creating a circle marker for each earthquake
        L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 0.75,
            color: quakeColor(depth),  // Function to determine color based on depth
            fillColor: quakeColor(depth),  // Function to determine color based on depth
            radius: magnitude * 10000  // Adjust as needed to get an appropriate scale
        }).bindPopup("<h3>" + feature.properties.place +
                     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag +"</h4>")  // Popup for each marker
        .addTo(myMap);
    });
}

// Define a function for Circle Color Base on Criteria. The Color Scale is base of the 7 colors of a Rainboy ROY G BIV
function quakeColor(qCcolor) {
    switch(true) {
        case (0 <= qCcolor && qCcolor <= 1.0):
          return "Red";
        case (1.0 <= qCcolor && qCcolor <= 2.0):
            return "Orange";
        case (2.0 <= qCcolor && qCcolor<= 3.0):
          return "Yellow";
        case (3.0 <= qCcolor && qCcolor<= 4.0):
            return "Green";
        case (4.0 <= qCcolor && qCcolor<= 5.0):
            return "Blue";
        case (5.0 <= qCcolor && qCcolor <= 6.0):
          return "Indigo";
        default:
          return "Violet";
    }
}
//   Create a circle function

function drawCircle(features, latlng){
  var CircleOptions = {
      radius: features.properties.mag * 8,
      fillColor: quakeColor(features.properties.mag),
      color: quakeColor(features.properties.mag),
      opacity: 1.0,
      fillOpacity: .5

  }
  return L.circleMarker(latlng, CircleOptions)
}
// Create a GeoJSON layer and run the onEachFeature function once for each earthquake feature.
var earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: drawCircle
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);

function createMap(earthquakes) {

  // Define streetmap and Satellite layers using OpenStreetMap
  var streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
    maxZoom: 19,
  });

  var Satellite = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
    maxZoom: 19,
  });

  var lightmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
    maxZoom: 19,
  });

  // Define baseMaps object 
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Satellite Map": Satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a map, giving it the streetmap and earthquakes layers 
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  function getColor(d){
    return d > 5 ? "#4B0082":
    d  > 4 ? "#0000FF":
    d > 3 ? "#008000":
    d > 2 ? "#FFFF00":
    d > 1 ? "#FFA500":
             "#FF0000";
  }
  

// Create a legend to display information about map
var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function(myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
}

// Add the info legend to the map
info.addTo(myMap);

  // Create a layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

