const { ipcRenderer } = require("electron");
let $ = ({ jQuery } = require("jquery"));

let divPrincipalInject = $("#bodycasas")
let div1 = $("#div-nom");
let div2 = $("#div-imagen");
let div3 = $("#div-descripcio");

//enviamos apenas abrimos la app un mensaje para cargar el contenido
ipcRenderer.send("load-content");

ipcRenderer.on("api-fotos", (e, info) => {
  let fotoObject = JSON.parse(info);
  fotoObject = fotoObject.data
  console.log(fotoObject);

  let name = $(`<p>${fotoObject.url}</p>`);
  let fax = $(`<p>${fotoObject.comentari}</p>`);

  div1.append(name);
  div2.append(fax);

  divPrincipalInject.append(div1,div2)
});
