const { ipcRenderer } = require("electron");
let $ = ({ jQuery } = require("jquery"));

// aqui creamos la variable del mapa y ponemos la posicion inicial a la que aparece (en el setView)
var map = L.map("map").setView([39.586006, 2.9], 10);

// añadimos el zoom del mapa a nuestro gusto
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// declaramos el marcador (marker)
var marker;

// declaramos el desplegable (popup)
var popup = L.popup();

// function de maponClick utilizada para comprobar la latitud y longitud sobre el mapa, actualmente en desuso
function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

// uso del map on Click
//map.on("click", onMapClick);

// señal para activar la generacion de contenido
ipcRenderer.send("load-content");

// recive el objeto de la api de fotos y pinta cada markador segun su latitud y longitud
// cada marker tiene un bindpopup que enseña la foto y el nombre de la casa
ipcRenderer.on("enviar-casas", function (e, info) {
  let fotoObject = info.data;
  fotoObject.forEach((_element) => {
    marker = L.marker([
      _element.allotjament.latitud,
      _element.allotjament.longitud,
    ])
      .addTo(map)
      .bindPopup(
        `<div class="bocadillo"><b>${_element.allotjament.nom}</b></br><img src="${_element.url}"></div>`
      );
    console.log(
      _element.allotjament.latitud + " " + _element.allotjament.longitud
    );
  });
});
