const { ipcRenderer } = require("electron");

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([200.5, -0.09]).addTo(map); // cambiar latitud y longitud por resultado de la api

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

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
