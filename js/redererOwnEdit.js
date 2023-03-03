const { ipcRenderer, dialog } = require("electron");
let $ = ({ jQuery } = require("jquery"));

//punteros
let divPrincipalInject = $("#body-casas");
let user_id;

//Enviamos apenas abrimos la app un mensaje para cargar el contenido.
ipcRenderer.send("load-content-dashboard");

//Recbimos el contenido de la api.
ipcRenderer.on("enviar-edit-mod", function (e, info, id) {
  user_id = id;

  //Conversión del JSON a objeto.
  let fotoObject = info.data;

  //Creación de los div con los botones de delete y edit
  fotoObject.forEach((_element) => {
    let divPrincipal = $(`<div class="col-sm-4 formato-cards"></div>`);

    let name = $(`<p>${_element.nom}</p>`);
    let descripcion = $(`<p>${_element.descripcio}</p>`);
    let botonEdit = $(
      `<button type="button" id="editButton" onclick='modificarCasa(${_element.id}, ${_element.propietari_id})'>EDIT</button>`
    );
    divPrincipal.append(name, descripcion, botonEdit);
    divPrincipalInject.append(divPrincipal);
  });
});

// Envia id al otro renderer.
function modificarCasa(id, propietari_id) {
  console.log("Modificando Casa, id: " + id);
  ipcRenderer.send("give-id", id);
  if (user_id == propietari_id) {
    ipcRenderer.send("editwindow")
  } else {
    dialog.showMessageBox({
      title: "Warning",
      buttons: ["Okay"],
      type: "info",
      message: "You are not allowed to modify this house!",
    });
  }
}
