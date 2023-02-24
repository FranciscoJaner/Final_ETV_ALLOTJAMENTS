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

  let newHouse = {
    nom: name,
    rnumero: rnumber,
    persones: people,
    banys: toilet,
    llits: beds,
    carrer: street,
    numero: number,
    municipi: municipality,
    categoria: category,
    propietari: owner,
  };

  ipcRenderer.send("insert-house", newHouse);
});
