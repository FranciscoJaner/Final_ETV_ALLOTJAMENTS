var map = L.map("map").setView([34.505, 3.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([60.354614, -0.995893]).addTo(map); // cambiar latitud y longitud por resultado de la api
var marker2;

getCoord();
function getCoord() {
  var longitud = [60.1436, 60.14, 60.1456];
  var latitud = [-0.99, -0.9912, -0.9916];
  for (var i = 0; i < longitud.length; i++) {
    console.log(longitud[i] + latitud[i]);
    marker2 = L.marker([longitud[i], latitud[i]]).addTo(map);
  }
}

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
