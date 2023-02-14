const { ipcRenderer } = require("electron");
let $ = ({ jQuery } = require("jquery"));

let div1 = $("#div-nom");
let div2 = $("#div-imagen");
let div3 = $("#div-descripcio");

ipcRenderer.send("load-content");

ipcRenderer.on("canal1", (e, info) => {
  let data = info.data.id;
  console.log(data);
  let name = $(`<p>${dades.data[2].nom}</p>`);
  let fax = $(`<p>${dades.data[1].id}</p>`);
  let descripcio = $(`<p>${dades.data[3].descripcio}</p>`);

  div1.append(name);
  div2.append(fax);
  div3.append(descripcio);
});
