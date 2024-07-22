// Initialize the map
var map = L.map('map', {drawControl: true}).setView([-37, 144], 8);

// Add a tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);