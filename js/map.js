const { ipcRenderer } = require("electron");

var map = L.map("map").setView([39.586006, 2.9], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker;

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

ipcRenderer.send("load-content");

ipcRenderer.on("enviar-casas", function (e, info) {
  let fotoObject = JSON.parse(info);
  fotoObject = fotoObject.data;
  fotoObject.forEach((_element) => {
    marker = L.marker([
      _element.allotjament.latitud,
      _element.allotjament.longitud,
    ]).addTo(map);
    console.log(
      _element.allotjament.latitud + " " + _element.allotjament.longitud
    );
  });
});
