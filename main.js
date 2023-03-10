//requires
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const { menu, menu2 } = require("./js/menu.js");
const { net } = require("electron");

// Varaibles globales.
let idcasa;
let mainWindow;
let userToken;
let userId;
let hostname = "etv.dawpaucasesnoves.com";
let protocol = "http:";

// Funcion para crear la window principal.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 300,
    minHeight: 150,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  mainWindow.newTimer = true;
  Menu.setApplicationMenu(menu);
  mainWindow.loadFile("index.html"); // Asignamos menu, exportamos, etc..
  module.exports.mainWindow = mainWindow;
  mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();

  setTimeout(function () {
    //Funcion que cuando se inicie la aplicacion, si estamos 5 segundos sin hacer nada nos mostrara un mensaje para indicar que se tiene que logear.
    if (mainWindow.newTimer)
      dialog.showMessageBox({
        type: "info",
        message:
          "Remember, if u want to see all the functionalities, please log in",
      });
  }, 5000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

//Funcion que le pasamos la informacion de el toquen y guarda en unas variables esta informacion para poder utilizarla mas adelante
function chargeToken(tokens) {
  tokenKey = JSON.parse(tokens);
  userId = tokenKey.data.usuari.id;
  userToken = tokenKey.data.token;

  console.log(userId);
  console.log(userToken);
}

// Funcion que pone el token en 0 y actualiza el menu, esta la exportamos, para utilizarla en el menu.js a la hora de hacer clic en la opcion.
function logOut() {
  userToken = 0;
  userId = 0;
  Menu.setApplicationMenu(menu);
}

module.exports.logout = logOut;

//MAINS

// Main para el login, a este le pasamos los datos de email y la contrase??a que no pase el renderer.
ipcMain.on("login-data", function (e, email, password) {
  const request = net.request({
    method: "POST",
    hostname: hostname,
    protocol: protocol,
    path: "etvServidor/public/api/login",
  });

  let body;

  let postData = JSON.stringify({
    email: `${email}`,
    password: `${password}`,
  });

  request.on("response", (response) => {
    response.on("data", (chunk) => {
      body = `${chunk}`;
      chargeToken(body);

      if (response.statusMessage == "OK") {
        Menu.setApplicationMenu(menu2);
        mainWindow.loadFile("./index.html");
      } else {
      }
    });
  });

  request.on("finish", () => {
    console.log("Request is Finished");
  });
  request.on("abort", () => {
    console.log("Request is Aborted");
  });
  request.on("error", (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`);
  });
  request.on("close", (error) => {
    console.log("Last Transaction has occurred");
  });
  request.setHeader("Content-Type", "application/json");
  request.write(postData, "utf-8");
  request.end();
});

//Main para cargar los datos de las casas de la pagina principal.
ipcMain.on("load-content", function (event) {
  const request = net.request({
    method: "GET",
    hostname: hostname,
    protocol: protocol,
    path: "etvServidor/public/api/fotos",
  });

  let body = "";

  request.on("response", (response) => {
    response.on("data", (chunk) => {
      body += chunk;
    });

    response.on("end", () => {
      //Una vez que ha terminado la petici??n entonces, enviamos el JSON a nuestro renderer
      event.sender.send("enviar-casas", JSON.parse(body));
      event.sender.send("enviar-edit", JSON.parse(body));
    });
  });
  request.on("finish", () => {
    console.log("Request is Finished");
  });
  request.on("abort", () => {
    console.log("Request is Aborted");
  });
  request.on("error", (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`);
  });
  request.on("close", (error) => {
    console.log("Last Transaction has occurred");
  });
  request.end();
});

// Main para cargar contenido de las graficas
ipcMain.on("load-content-dashboard", function (event, tipo) {
  const request = net.request({
    method: "GET",
    hostname: hostname,
    protocol: protocol,
    path: "etvServidor/public/api/allotjaments",
  });

  let body = "";

  request.on("response", (response) => {
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      //Una vez que ha terminado la petici??n entonces, enviamos el JSON a nuestro renderer
      event.sender.send("enviar-info-casas", JSON.parse(body));
      event.sender.send(
        "enviar-edit-mod",
        JSON.parse(body),
        JSON.parse(userId)
      );
    });
  });

  request.on("finish", () => {
    console.log("Request is Finished");
  });
  request.on("abort", () => {
    console.log("Request is Aborted");
  });
  request.on("error", (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`);
  });
  request.on("close", (error) => {
    console.log("Last Transaction has occurred");
  });
  request.end();
});

//Main para insertar una casa
ipcMain.on("insert-house", function (e, info) {
  const request = net.request({
    method: "POST",
    hostname: hostname,
    protocol: protocol,
    path: "etvServidor/public/api/allotjaments",
    headers: {
      "Content-Type": "application/json", // Diferentes headers necessarios para la peticion.
      accept: "application/json",
    },
  });

  let casa = info; // Recogemos el objeto que nos pasa el renderer.
  casa.propietari_id = userId; // Le asignamos al atributo propietari, el id del usuario que se ha logeado haciendo asi que el propietario de la casa sea el usuario que se ha logeado.

  let postData = JSON.stringify(casa);

  request.setHeader("Authorization", "Bearer " + userToken); // Asignamos el token para que nos deje realizar la petici??n.

  request.on("response", (response) => {
    response.on("data", (chunk) => {});

    response.on("end", () => {
      //Una vez que ha terminado la petici??n, si el statusCode es correcto saldra un dialogo y nos enviara a la pagina index.
      if (response.statusCode == "200") {
        mostrarDialog("You have created the house correctly");
        mainWindow.loadFile("index.html");
      }
    });
  });
  request.on("finish", () => {
    console.log("Request is Finished");
  });
  request.on("abort", () => {
    console.log("Request is Aborted");
  });
  request.on("error", (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`);
  });
  request.on("close", (error) => {
    console.log("Last Transaction has occurred");
  });

  request.write(postData, "utf-8");
  request.end();
});

//Main para editar una casa., en este le asignamos el token con un setHeader.
ipcMain.on("edit_house", function (e, args) {
  const request = net.request({
    method: "PUT",
    hostname: hostname,
    protocol: protocol,
    path: `etvServidor/public/api/allotjaments/${idcasa}`,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  let casa = args; // Convertimos lo que envia el renderer en un objeto casa.
  casa.propietari_id = userId; // Asignamos la id del usuario a la id de propietario, para que cuando se edite la casa este sea el mismo.

  const postData = JSON.stringify(casa);

  request.setHeader("Authorization", "Bearer " + userToken);

  request.on("response", (response) => {
    response.on("data", (chunk) => {});

    response.on("end", () => {
      if (response.statusCode == "200") {
        // En el caso que el status code sea Ok, hara lo siguiente
        mostrarDialog("You have edited the house successfully");
        mainWindow.loadFile("./html/edit_own_house.html");
      } else {
        mostrarDialog("Error"); // Sino mostrara un dialogo de error
      }
    });
  });

  request.on("error", (error) => {
    console.error(error);
  });

  request.write(postData, "utf-8");
  request.end();
});

//Main para borrar una casa, en este caso el usuario tiene que ser administador para permittir esta peticion.
ipcMain.on("delete_house", function (e, args) {
  const request = net.request({
    method: "DELETE",
    hostname: "etv.dawpaucasesnoves.com",
    port: 80,
    path: `/etvServidor/public/api/allotjaments/${args}`,
    headers: {
      Authorization: `Bearer ${userToken}`, // Asignamos el token, esta vez de diferente manera para ver las diferentes opciones que podemos utilizar.
    },
  });

  let body = "";
  request.on("response", (response) => {
    response.on("data", (chunk) => {
      body += chunk;
    });

    response.on("end", () => {
      console.log(body);
    });
  });

  request.on("error", (error) => {
    console.error(error);
  });

  request.end();
});

//Main el cual lo utilizamos para devolver los datos de una casa en concreto, a este le introducimos el id de la casa que queremos recoger los datos. Una vez realizada la peticion enviamos la informacion al renderer
ipcMain.on("inyectar-datos", function (e) {
  const request = net.request({
    method: "GET",
    hostname: hostname,
    port: 80,
    path: `/etvServidor/public/api/allotjaments/${idcasa}`,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  let body = "";
  request.on("response", (response) => {
    response.on("data", (chunk) => {
      body += chunk;
    });

    response.on("end", () => {
      e.sender.send("enviando-datos-concretos", JSON.parse(body));
    });
  });

  request.on("error", (error) => {
    console.error(error);
  });

  request.end();
});

//Main que guardara la id de la casa en una variable, sgun la id que le pasemos desde el renderer
ipcMain.on("idcasa", function (e, id) {
  idcasa = id;
});

// Main que cambiara la ventana cuando el id del usuario y la id de lpropietario coincidad.
ipcMain.on("editwindow", function () {
  mainWindow.loadFile("./html/form_edit_house.html");
});

// Main el cual mostraremos un dialogo cuando el renderer realize la peticion segun, el mensaje que este nos envie.
ipcMain.on("mostrarDialog", function (e, text) {
  mostrarDialog(text);
});

// Funcion que le pasamos por parametro un texto, que mostrara un dialogo con ese texto que le pasamos.
function mostrarDialog(text) {
  dialog.showMessageBox({
    title: "Info",
    buttons: ["Okay"],
    type: "info",
    message: `${text}`,
  });
}
