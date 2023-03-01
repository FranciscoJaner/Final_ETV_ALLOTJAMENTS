const { ipcRenderer, dialog } = require("electron");
let $ = ({ jQuery } = require("jquery"));

//punteros
let divPrincipalInject = $("#body-casas");
let user_id;

//enviamos apenas abrimos la app un mensaje para cargar el contenido
ipcRenderer.send("load-content-dashboard");

//recebimos el contenido de la api
ipcRenderer.on("enviar-edit-mod", function (e, info, id) {
  //conversión del JSON a objeto
  user_id = id;

  let fotoObject = JSON.parse(info);
  fotoObject = fotoObject.data;

  //creación de los div con los botones de delete y edit
  fotoObject.forEach((_element) => {
    let divPrincipal = $(`<div class="col-sm-4 formato-cards"></div>`);

    let name = $(`<p>${_element.nom}</p>`);
    let descripcion = $(`<p>${_element.descripcio}</p>`);
    let botonEdit = $(
      `<button type="button" id="editButton" onclick='modificarCasa(${_element.id}, ${_element.propietari_id})'>EDIT</button>`
    );
    divPrincipal.append(name, descripcion, botonEdit);
    console.log(divPrincipal);
    divPrincipalInject.append(divPrincipal);
  });
});

// envia id al otro renderer y crea una ventana modal
function modificarCasa(id, propietari_id) {
  console.log("Modificando Casa, id: " + id);
  ipcRenderer.send("give-id", id);
  if (user_id == propietari_id) {
    ipcRenderer.send("open-window", "./html/edit_screen.html");
  } else {
    dialog.showMessageBox({
      type: "info",
      message: "You are not allowed to edit this house!",
    });
  }
}
