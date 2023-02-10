function validar() {
  let ok_email = validar_email();
  let ok_password = validar_contrasenya();

  return ok_email && ok_password;
}

function contrasenya() {
  let x = document.getElementById("pass");
  let y = document.getElementById("hide1");
  let z = document.getElementById("hide2");

  if (x.type === "password") {
    x.type = "text";
    y.style.display = "block";
    z.style.display = "none";
  } else {
    x.type = "password";
    y.style.display = "none";
    z.style.display = "block";
  }
}

function validar_email() {
  let patron = `/^[a-z]{3,}((_[a-z]{3,})*|(.[a-z]{3,})*)?@[a-z]{3,}[.][a-z]{2,4}$/`;
  let elemento = document.querySelector("#emailForm");
  let mensaje = document.querySelector("label[for='emailForm'] span");

  if (elemento.value.length !== 0) {
    if (patron.test(elemento.value)) {
      mensaje.innerHTML = "";
      return true;
    } else {
      mensaje.innerHTML = " Incorrect";
      return false;
    }
  }
  mensaje.innerHTML = " Required";

  return false;
}

function validar_contrasenya() {
  let patron = `/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/`;
  let elemento = document.querySelector("#passwordForm");
  let mensaje = document.querySelector("label[for='passwordForm'] span");

  if (elemento.value.length !== 0) {
    if (patron.test(elemento.value)) {
      mensaje.innerHTML = "";
      return true;
    } else {
      mensaje.innerHTML =
        " It must have: 8 Characters, at least 1 letter and 1 number";
      return false;
    }
  }
  mensaje.innerHTML = " Required";

  return false;
}
