const { ipcRenderer } = require("electron");
let $ = ({ jQuery } = require("jquery"));

let form = document.getElementById("edithouseform");

ipcRenderer.send("inyectar-datos"); //Hacemos petición para que nos devuelvan la info de la casa.

//Selectores.
let name = document.getElementById("nameInput");
let rnumber = document.getElementById("r_numberInput");
let people = document.getElementById("peopleInput");
let toilet = document.getElementById("toiletInput");
let beds = document.getElementById("bedsInput");
let street = document.getElementById("strInput");
let number = document.getElementById("numInput");
let municipality = document.getElementById("munInput");
let category = document.getElementById("cateInput");
let description = document.getElementById("description");
let bath = document.getElementById("bathInput");
let pisporta = document.getElementById("pisInput");
let accommodationtype = document.getElementById("allInput");
let vacationtype = document.getElementById("typInput");
let longitude = document.getElementById("longInput");
let latitude = document.getElementById("latInput");

ipcRenderer.on("enviando-datos-concretos", function (e, datos) {
  let info = datos.data; //Recuperamos todos los datos
  //Asignamos los valores que nos retornan dentro del formulario
  name.value = info.nom;
  rnumber.value = info.nregistre;
  people.value = info.npersones;
  toilet.value = info.nbanys;
  beds.value = info.nllits;
  street.value = info.carrer;
  number.value = info.numero;
  municipality.value = info.municipi_id;
  category.value = info.categoria_id;
  description.value = info.descripcio;
  bath.value = info.nhabitacions;
  pisporta.value = info.pisporta;
  accommodationtype.value = info.tipus_allotjament_id;
  vacationtype.value = info.tipus_vacances_id;
  longitude.value = info.longitud;
  latitude.value = info.latitud;
});

// Le da valor a todos los campos segun lo puesto en el formulario
form.addEventListener("submit", function () {
  let name = document.getElementById("nameInput").value;
  let rnumber = document.getElementById("r_numberInput").value;
  let people = document.getElementById("peopleInput").value;
  let toilet = document.getElementById("toiletInput").value;
  let beds = document.getElementById("bedsInput").value;
  let street = document.getElementById("strInput").value;
  let number = document.getElementById("numInput").value;
  let municipality = document.getElementById("munInput").value;
  let category = document.getElementById("cateInput").value;
  let description = document.getElementById("description").value;
  let bath = document.getElementById("bathInput").value;
  let pisporta = document.getElementById("pisInput").value;
  let accommodationtype = document.getElementById("allInput").value;
  let vacationtype = document.getElementById("typInput").value;
  let longitude = document.getElementById("longInput").value;
  let latitude = document.getElementById("latInput").value;

  let editHouse = {
    nom: name,
    descripcio: description,
    nregistre: rnumber,
    npersones: people,
    nbanys: toilet,
    nllits: beds,
    nhabitacions: bath,
    carrer: street,
    numero: number,
    pisporta: pisporta,
    municipi_id: municipality,
    tipus_allotjament_id: accommodationtype,
    tipus_vacances_id: vacationtype,
    propietari_id: null,
    categoria_id: category,
    longitud: longitude,
    latitud: latitude,
  };

  ipcRenderer.send("edit_house", editHouse);
});

ipcRenderer.on("edit-finished", function (e) {
  e.sender.send("edit_house");
});
