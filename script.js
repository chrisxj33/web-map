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

var landuseColors = {
    "Abandoned irrigated land": "grey",
    "Abandoned manufacturing and industrial": "grey",
    "Abattoirs": "darkred",
    "Airports/aerodromes": "grey",
    "Aquaculture": "blue",
    "Bulk grain storage": "goldenrod",
    "Cereals": "goldenrod",
    "Channel/aqueduct": "blue",
    "Commercial services": "grey",
    "Cropping": "goldenrod",
    "Dairy sheds and yards": "saddlebrown",
    "Defence facilities - urban": "grey",
    "Drainage channel/aqueduct": "blue",
    "Effluent pond": "darkslategray",
    "Electricity substations and transmission": "grey",
    "Evaporation basin": "lightblue",
    "Extractive Industry not in use": "grey",
    "Feedlots": "saddlebrown",
    "Food processing factory": "brown",
    "Fuel powered electricity generation": "grey",
    "Gas treatment, storage and transmission": "grey",
    "General purpose factory": "brown",
    "Glasshouses": "lightgreen",
    "Glasshouses - hydroponic": "lightgreen",
    "Grapes": "green",
    "Grazing irrigated modified pastures": "green",
    "Grazing modified pastures": "green",
    "Grazing native vegetation": "green",
    "Hardwood plantation forestry": "green",
    "Horse studs": "saddlebrown",
    "Hydro electricity generation": "blue",
    "Intensive animal production": "saddlebrown",
    "Intensive Uses": "grey",
    "Irrigated cereals": "green",
    "Irrigated citrus": "green",
    "Irrigated cropping": "green",
    "Irrigated environmental forest plantation": "green",
    "Irrigated grapes": "green",
    "Irrigated hardwood plantation forestry": "green",
    "Irrigated hay and silage": "green",
    "Irrigated land in transition": "green",
    "Irrigated oilseeds": "green",
    "Irrigated olives": "green",
    "Irrigated perennial horticulture": "green",
    "Irrigated perennial vegetables and herbs": "green",
    "Irrigated plantation forests": "green",
    "Irrigated pulses": "green",
    "Irrigated seasonal flowers and bulbs": "green",
    "Irrigated seasonal horticulture": "green",
    "Irrigated seasonal vegetables and herbs": "green",
    "Irrigated softwood plantation forestry": "green",
    "Irrigated tree fruits": "green",
    "Irrigated tree nuts": "green",
    "Irrigated turf farming": "green",
    "Irrigated vine fruits": "green",
    "Lake": "blue",
    "Lake - conservation": "blue",
    "Lake - production": "blue",
    "Land in transition": "blue",
    "Landfill": "brown",
    "Major industrial complex": "brown",
    "Manufacturing and industrial": "brown",
    "Marsh/wetland": "darkgreen",
    "Marsh/wetland - conservation": "darkgreen",
    "Mines": "black",
    "Mining": "black",
    "National park": "darkgreen",
    "Natural feature protection": "darkgreen",
    "Navigation and communication": "grey",
    "No defined use": "grey",
    "No defined use - irrigation": "grey",
    "Oil refinery": "black",
    "Oilseeds": "goldenrod",
    "Other conserved area": "darkgreen",
    "Other minimal use": "grey",
    "Perennial flowers and bulbs": "green",
    "Perennial horticulture": "green",
    "Piggeries": "saddlebrown",
    "Plantation forests": "green",
    "Ports and water transport": "blue",
    "Poultry farms": "saddlebrown",
    "Production native forests": "green",
    "Production nurseries": "lightgreen",
    "Protected landscape": "darkgreen",
    "Public services": "grey",
    "Pulses": "green",
    "Quarries": "black",
    "Railways": "grey",
    "Recreation and culture": "purple",
    "Rehabilitation": "green",
    "Research facilities": "grey",
    "Reservoir": "blue",
    "Reservoir/dam": "blue",
    "Residential and farm infrastructure": "green",
    "Residual native cover": "green",
    "River": "blue",
    "River - conservation": "blue",
    "River - production": "blue",
    "Roads": "grey",
    "Rural residential with agriculture": "green",
    "Rural residential without agriculture": "grey",
    "Saleyards/stockyards": "saddlebrown",
    "Sawmill": "brown",
    "Seasonal horticulture": "green",
    "Seasonal vegetables and herbs": "green",
    "Services": "grey",
    "Sewage/sewerage": "darkslategray",
    "Shrub berries and fruits": "green",
    "Softwood plantation forestry": "green",
    "Stormwater": "blue",
    "Strict nature reserves": "darkgreen",
    "Supply channel/aqueduct": "blue",
    "Surface water supply": "blue",
    "Transport and communication": "grey",
    "Tree nuts": "green",
    "Urban residential": "grey",
    "Utilities": "grey",
    "Vine fruits": "green",
    "Waste treatment and disposal": "darkslategray",
    "Water extraction and transmission": "blue",
    "Water storage - intensive use/farm dams": "blue",
    "Wind electricity generation": "lightblue",
    "Wood production forestry": "green"
};

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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Tell server content in JSON format
                },
                body: JSON.stringify(data) // The data being sent
            })
            .then(response => response.json()) // The response from the server once sent
            .then(data => {
                console.log('Success:', data);

                // Clear existing layers on success
                editableLayers.clearLayers();

                // Loop through the returned data
                data.forEach(row => {
                    // Get attributes
                    var geometry = row[0];
                    // var area_name = row[5];
                    var area_desc = row[21];

                    // Convert WKT to GeoJSON using Wicket
                    var wkt = new Wkt.Wkt();
                    wkt.read(geometry);
                    var geojson = wkt.toJson();

                    // Add data to map
                    L.geoJSON(geojson, {
                        style: {
                            color: landuseColors[area_desc] || 'black' // Fallback to 'black' if no color
                        }
                    }).addTo(editableLayers);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});