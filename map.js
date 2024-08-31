// Initialise the map
var map = L.map('map').setView([-37, 144], 8);

// Add a tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// Initialize the FeatureGroup to store editable (user defined) layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// Initialize the FeatureGroup to store queried layers
var queriedLayers = new L.FeatureGroup();
map.addLayer(queriedLayers);

// Customize the draw control to show only the rectangle button
var drawControl = new L.Control.Draw({
    draw: {
        polyline: false,
        polygon: false,
        circle: false,
        marker: false,
        circlemarker: false,
        rectangle: {
            shapeOptions: {
                clickable: true
            }
        }
    },
    edit: {
        featureGroup: editableLayers,
        edit: true
    }
});
map.addControl(drawControl);

// Disable the get-data-btn initially
var getDataBtn = document.getElementById('get-data-btn');
getDataBtn.disabled = true;
getDataBtn.style.backgroundColor = "grey";

// Function to check if editableLayers is empty and enable/disable button
function updateButtonState() {
    if (editableLayers.getLayers().length === 0) {
        getDataBtn.disabled = true;
        getDataBtn.style.backgroundColor = "grey";
    } else {
        getDataBtn.disabled = false;
        getDataBtn.style.backgroundColor = ""; // Reset to default
    }
}

// Add created layers to the map and clear existing layers
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    // Remove previous drawn layer
    editableLayers.clearLayers();
    
    // Add the new layer
    editableLayers.addLayer(layer);

    // Allow button to be clickable
    updateButtonState()

});

// Map land use types to colours for visualisation
var landuseColors = {
    "Commercial": "orange",
    "Cropping": "green",
    "Defence": "darkred",
    "Forestry": "forestgreen",
    "Citrus": "yellow",
    "Forest": "darkgreen",
    "Turf": "lightgreen",
    "Transition": "lightgrey",
    "Livestock": "brown",
    "Manufacturing": "blue",
    "Conservation": "teal",
    "Minimal": "lightblue",
    "Quarries": "darkgrey",
    "Recreational": "purple",
    "Residential": "pink",
    "Transport": "red",
    "Utilities": "gold",
};


function map_data(queried_data) {

    // Clear editable layers
    editableLayers.clearLayers();

    // Clear querried layers
    queriedLayers.clearLayers();

    // Make button no longer clickable
    updateButtonState()

    // Loop through the returned data
    queried_data.forEach(row => {
        // Get attributes
        var geometry = row[0];
        var area_desc = row[21];

        // Convert WKT to GeoJSON using Wicket
        var wkt = new Wkt.Wkt();
        wkt.read(geometry);
        var geojson = wkt.toJson();

        // Add data to map
        L.geoJSON(geojson, {
            style: {
                color: landuseColors[area_desc] || 'black', // Fallback to 'black' if no color
                weight: 1,
                fillOpacity: 0.5
            }
        }).addTo(queriedLayers);

    });

    render_chart(queried_data, barChartInstance, pieChartInstance)
}

// Add event listener to the button
document.getElementById('get-data-btn').addEventListener('click', function() {
    editableLayers.eachLayer(function(layer) {
        var bounds = layer.getBounds();
        var northEast = bounds.getNorthEast();
        var southWest = bounds.getSouthWest();

        // Prepare the data for transit
        var send_data = {
            NE: {
                lat: northEast.lat,
                lng: northEast.lng
            },
            SW: {
                lat: southWest.lat,
                lng: southWest.lng
            }
        };

        // Send to Flask endpoint
        fetch('http://127.0.0.1:5000/coordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tell server content in JSON format
            },
            body: JSON.stringify(send_data) // The data being sent
        })
        .then(response => response.json()) // The response from the server once sent
        .then(queried_data => {
            console.log('Success:', queried_data);
            
            // On success, map the data
            map_data(queried_data, barChartInstance, pieChartInstance);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});