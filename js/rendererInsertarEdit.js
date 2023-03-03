const { ipcRenderer } = require("electron");

let form = document.getElementById("edithouseform");

let id = "";

// le da valor a todos los campos segun lo puesto en el formulario
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
    id: null,
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

  // Recoge la id del otro renderer
  ipcRenderer.on("give-id", function (e, args) {
    id = args;
  });

  ipcRenderer.send("edit-house", editHouse, id);
});

ipcRenderer.on("edit-finished", function (e) {
  e.sender.send("edit-house");
});
