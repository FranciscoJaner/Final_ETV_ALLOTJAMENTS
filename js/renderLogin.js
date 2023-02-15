const { ipcRenderer } = require("electron");

//POINTERS
let form = document.getElementById("login-form");
//events

form.addEventListener("submit", function () {
  // Enviar datos al ipcmain
  let correo = document.getElementById("email").value;
  let passwd = document.getElementById("passwd").value;
  ipcRenderer.send("login-data", correo, passwd);
});

ipcRenderer.on("login-finished", function (e) {
  console.log("hemos llegado al renderer con el token");
  e.sender.send("load-content");
});
