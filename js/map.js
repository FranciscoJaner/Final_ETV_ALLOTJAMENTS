const { ipcRenderer } = require("electron");

var map = L.map("map").setView([34.505, 3.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([60.354614, -0.995893]).addTo(map); // cambiar latitud y longitud por resultado de la api

marker.bindPopup("<b>Location Allotjament</b>.").openPopup();

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

ipcRenderer.on("canalmapa", (e, latitud, longitud) => {
  console.log("longitud: " + longitud + " latitud: " + latitud);
});
