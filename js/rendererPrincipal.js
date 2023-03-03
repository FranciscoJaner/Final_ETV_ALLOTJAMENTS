const { ipcRenderer } = require("electron");
let $ = ({ jQuery } = require("jquery"));

//Punteros
let divPrincipalInject = $(".body-casas");

//Enviamos apenas abrimos la app un mensaje para cargar el contenido.
ipcRenderer.send("load-content");

//recebimos el contenido de la api.
ipcRenderer.on("enviar-casas", function (e, info) {
  //Conversión del JSON a objeto.
  fotoObject = info.data;

  //Creación de los div.
  fotoObject.forEach((_element) => {
    let divPrincipal = $(`<div class="col-sm-4 formato-cards"></div>`);

    let imagen = $(`<img src="${_element.url}"/>`);
    let name = $(`<p>${_element.allotjament.nom}</p>`);
    let descripcion = $(`<p>${_element.allotjament.descripcio}</p>`);

    divPrincipal.append(imagen, name, descripcion);
    console.log(divPrincipal);
    divPrincipalInject.append(divPrincipal);
  });
});
