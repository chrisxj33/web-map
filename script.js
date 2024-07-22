// Initialize the map
var map = L.map('map').setView([-37, 144], 8);

// Add a tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

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

// Add created layers to the map and clear existing layers
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    // Remove previous drawn layer
    editableLayers.clearLayers();
    
    // Add the new layer
    editableLayers.addLayer(layer);

});

// Add event listener to the button
document.getElementById('get-data-btn').addEventListener('click', function() {
    editableLayers.eachLayer(function(layer) {
            var bounds = layer.getBounds();
            var northEast = bounds.getNorthEast();
            var southWest = bounds.getSouthWest();
            // console.log('North-East:', northEast);
            // console.log('South-West:', southWest);

            // Prepare the data for transit
            var data = {
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
                    method: 'POST', // Set POST since sending data
                    headers: {
                        'Content-Type': 'application/json' // Tell server content is in JSON format
                    },
                    body: JSON.stringify(data) // The data itself (as JSON)
                })
                .then(response => response.json()) // The response from the server once sent
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
            });
    });
});