const { ipcRenderer } = require("electron")
let $ = ({ jQuery } = require("jquery"))

//punteros
let divPrincipalInject = $('#body-casas');

//enviamos apenas abrimos la app un mensaje para cargar el contenido
ipcRenderer.send("load-content");

//recebimos el contenido de la api
ipcRenderer.on("enviar-casas", function(e, info) {
  //conversión del JSON a objecto
  let fotoObject = JSON.parse(info);
  fotoObject = fotoObject.data;

  //creación de los div
  fotoObject.forEach((_element) => {
    let divPrincipal = $(`<div class="col-sm-4"></div>`);

    let imagen = $(`<p>${_element.url}</p>`);
    let name = $(`<p>${_element.allotjament.nom}</p>`);
    let descripcion = $(`<p>${_element.allotjament.descripcio}</p>`);

    divPrincipal.append(imagen,name,descripcion);
    console.log(divPrincipal)
    divPrincipalInject.append(divPrincipal)
  })
});
