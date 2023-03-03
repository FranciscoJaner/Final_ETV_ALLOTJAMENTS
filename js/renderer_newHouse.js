const { ipcRenderer , dialog} = require("electron");

let form = document.getElementById("newhouseForm");

form.addEventListener("submit", function () {
  // Recogemos todos los valores de los elementos y los introducimos en una variable.
  let name = document.getElementById("nameInput").value;
  let rnumber = document.getElementById("registInput").value;
  let people = document.getElementById("peopleInput").value;
  let toilet = document.getElementById("toiletInput").value;
  let beds = document.getElementById("bedsInput").value;
  let street = document.getElementById("strInput").value;
  let number = document.getElementById("numInput").value;
  let municipality = document.getElementById("munInput").value;
  let category = document.getElementById("cateInput").value;
  let description = document.getElementById("description").value;
  let bath = document.getElementById("bethInput").value;
  let pisporta = document.getElementById("pisInput").value;
  let accommodationtype = document.getElementById("allInput").value;
  let vacationtype = document.getElementById("typInput").value;
  let longitude = document.getElementById("longInput").value;
  let latitude = document.getElementById("latInput").value;

  // Creamos un objeto con los valores que recogemos que sera lo que le pasamos a traves del renderer.
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
    tipus_allotjament_id: accommodationtype,
    tipus_vacances_id: vacationtype,
    propietari_id: null,
    categoria_id: category,
    longitud: longitude,
    latitud: latitude,
  };

  //Mostramos un mensaje de que se ha creado correctamente la casa
  dialog.showMessageBox({
    type: "info",
    message:
        "Casa creada correctamente",
  });
  // Enviamos al main todos los datos.
  ipcRenderer.send("insert-house", newHouse);

});

ipcRenderer.on("insert-finished", function (e) {
  e.sender.send("insert-house");
});
