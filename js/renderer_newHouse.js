const { ipcRenderer } = require("electron");

let form = document.getElementById("newhouseForm");

form.addEventListener("submit", function () {
  // Enviar datos al ipcmain
  let name = document.getElementById("nameInput").value;
  let rnumber = document.getElementById("registInput").value;
  let people = document.getElementById("peopleInput").value;
  let toilet = document.getElementById("toiletInput").value;
  let beds = document.getElementById("bedsInput").value;
  let street = document.getElementById("strInput").value;
  let number = document.getElementById("numInput").value;
  let municipality = document.getElementById("munInput").value;
  let category = document.getElementById("cateInput").value;
  let owner = document.getElementById("ownerInput").value;
  let description = document.getElementById("description").value;
  let bath = document.getElementById("bethInput").value;
  let pisporta = document.getElementById("pisInput").value;
  let all = document.getElementById("allInput").value;
  let type = document.getElementById("typInput").value;
  let longitude = document.getElementById("longInput").value;
  let latitude = document.getElementById("latInput").value;

  let newHouse = {
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
    tipus_allotjament_id: all,
    tipus_vacances_id: type,
    propietari_id: owner,
    categoria_id: category,
    longitud: longitude,
    latitud: latitude,
  };

  ipcRenderer.send("insert-house", newHouse);
});

ipcRenderer.on("insert-finished", function (e) {
  e.sender.send("insert-house");
});
