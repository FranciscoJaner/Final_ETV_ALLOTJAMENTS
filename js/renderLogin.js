const { ipcRenderer } = require("electron");

//POINTERS
let form = document.getElementById("login-form");

//Eventos
form.addEventListener("submit", function () {
  // Enviar datos al ipcmain
  let correo = document.getElementById("email").value; // Recogemos los valores del formulario.
  let passwd = document.getElementById("passwd").value;
  ipcRenderer.send("login-data", correo, passwd); // Le enviamos estos valores al main por el canal login-data.
});

ipcRenderer.on("login-finished", function (e) {
  console.log("hemos llegado al renderer con el token");
  e.sender.send("load-content");
});
