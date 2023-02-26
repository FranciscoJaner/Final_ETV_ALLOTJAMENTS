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

  //creación de los div con los botones de delete y edit
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

// envia id al otro renderer y crea una ventana modal
function modificarCasa(id) {
  console.log("Modificando Casa, id: " + id);
  ipcRenderer.send("give-id", id);
  ipcRenderer.send("open-window", "./html/edit_screen.html");
}

// invia la id al main y borra según esta(no funciona ya que no somos user admin)
function borrarCasa(id) {
  console.log("Borrando casa, id: " + id);
  ipcRenderer.send("delete_house", id);
}
