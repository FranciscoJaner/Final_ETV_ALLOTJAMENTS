//requires
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const { menu, menu2 } = require("./js/menu.js");
const { net } = require("electron");

//variable globals
let mainWindow;
let userToken;
let userId;
let hostname = "etv.dawpaucasesnoves.com";
let protocol = "http:";

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
  mainWindow.loadFile("index.html");
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

// Main para el login.
ipcMain.on("login-data", function (e, email, password) {
  //ahora tenemos que enviar la petición
  const request = net.request({
    method: "POST",
    hostname: hostname,
    protocol: protocol,
    path: "etvServidor/public/api/login",
  });

  let body;

  let postData = JSON.stringify({
    //
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
      //Una vez que ha terminado la petición entonces, enviamos el JSON a nuestro renderer
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
      //Una vez que ha terminado la petición entonces, enviamos el JSON a nuestro renderer.
    });
    response.on("end", () => {
      //Una vez que ha terminado la petición entonces, enviamos el JSON a nuestro renderer
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
      "Content-Type": "application/json", // Diferentes headers necessarios para la peticion
      accept: "application/json",
    },
  });

  let casa = info; // Recogemos el objeto que nos pasa el renderer.
  casa.propietari_id = userId; // Le asignamos al atributo propietari, el id del usuario que se ha logeado haciendo asi que el propietario de la casa sea el usuario que se ha logeado.

  let postData = JSON.stringify(casa);

  request.setHeader("Authorization", "Bearer " + userToken); // Asignamos el token para que nos deje realizar la petición.

  request.on("response", (response) => {
    response.on("data", (chunk) => {});
    console.log(response.statusMessage);
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
ipcMain.on("edit_house", function (e, args, id) {
  const request = net.request({
    method: "PUT",
    hostname: hostname,
    protocol: protocol,
    path: `etvServidor/public/api/allotjaments`,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  let casa = args;
  casa.propietari_id = userId;
  casa.id = id;
  const postData = JSON.stringify(casa);

  request.setHeader("Authorization", "Bearer " + userToken);

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
