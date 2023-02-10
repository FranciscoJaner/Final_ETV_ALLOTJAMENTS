const { ipcRenderer } = require ('electron');

function validar() {

  let okay_passwd = validar_passwd();
  let okay_email= validar_email();

  ipcRenderer.send('verificacion',okay_passwd && okay_email) ;
}

function validar_passwd() {
  let patron = /^[a-zA-Z0-9]{6,}$/;
  let elemeto = document.getElementById("passwordForm");
  let mensaje = document.querySelector("label[for='passwordForm'] span");

  if (elemeto.value.length !== 0)
  {
    if (patron.test(elemeto.value))
    {
      mensaje.innerHTML = "";
      return true;
    }
    else
    {
      mensaje.innerHTML = "Incorrecto";
      return false;
    }
  }
  mensaje.textContent = "*Obligatorio";

  return false;
}

function validar_email() {
  let patron = /^[a-z]{3,}((_[a-z]{3,})*|(\.[a-z]{3,})*)?@[a-z]{3,}[.][a-z]{2,4}$/;
  let elemeto = document.getElementById("emailForm");
  let mensaje = document.querySelector("label[for='emailForm'] span")

  if (elemeto.value.length !== 0)
  {
    if (patron.test(elemeto.value))
    {
      mensaje.innerHTML = "";
      return true;
    }
    else
    {
      mensaje.innerHTML = "Incorrecto";
      return false;
    }
  }
  mensaje.innerHTML = "*Obligatorio";

  return false;}


