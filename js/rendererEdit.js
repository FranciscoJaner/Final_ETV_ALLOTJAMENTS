const { ipcRenderer } = require("electron");
let $ = ({ jQuery } = require("jquery"));

//punteros
let divPrincipalInject = $("#body-casas");

//enviamos apenas abrimos la app un mensaje para cargar el contenido
ipcRenderer.send("load-content");

//recebimos el contenido de la api
ipcRenderer.on("enviar-edit", function (e, info) {
  //conversión del JSON a objecto
  let fotoObject = JSON.parse(info);
  fotoObject = fotoObject.data;

  //creación de los div
  fotoObject.forEach((_element) => {
    let divPrincipal = $(`<div class="col-sm-4 formato-cards"></div>`);

    let imagen = $(`<img src="${_element.url}"/>`);
    let name = $(`<p>${_element.allotjament.nom}</p>`);
    let descripcion = $(`<p>${_element.allotjament.descripcio}</p>`);
    let botonEdit = $(
      `<button type="button" id="editButton" onclick='modificarCasa(${_element.allotjament.id})'>EDIT</button>`
    );
    let botonDelete = $(
      `<button type="button" id="deleteButton" onclick='borrarCasa(${_element.allotjament.id})'>DELETE</button>`
    );

    divPrincipal.append(imagen, name, descripcion, botonEdit, botonDelete);
    console.log(divPrincipal);
    divPrincipalInject.append(divPrincipal);
  });
});

function modificarCasa(id) {
  console.log("Modificando Casa, id: " + id);
  // levar a la pantalla de modificar
  ipcRenderer.send("edit_house", id);
}

function borrarCasa(id) {
  console.log("Borrando casa, id: " + id);
  ipcRenderer.send("borrar_house", id);
}
