const { ipcRenderer } = require("electron");

//POINTERS
const correo = document.getElementById("email").value;
const passwd = document.getElementById("passwd").value;
let button = document.getElementById("button-login");
//events

button.addEventListener("click", function () {
  if (correo.length() < 1 || !passwd.length() < 1) {
    alert("Por favor complete todos los campos.");
    return;
  } else {
    // Enviar datos al ipcmain
    ipcRenderer.send("login-data", correo, passwd);
  }
});

ipcRenderer.on("login-finished", function (e) {
  console.log("hemos llegado al renderer con el token");
  e.sender.send("load-content");
});
