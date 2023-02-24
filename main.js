//requires
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const { menu, menu2 } = require("./js/menu.js");
const { net } = require("electron");

//variable globals
let mainWindow;
let userToken;
let userId;
let dadesmapa;
let latitud;
let longitud;
let hostname = "etv.dawpaucasesnoves.com";
let protocol = "http:";
let x = false;

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

  Menu.setApplicationMenu(menu);
  mainWindow.loadFile("index.html");
  module.exports.mainWindow = mainWindow;
  mainWindow.webContents.openDevTools();
}
app.on("ready", () => {
  createWindow();
  setTimeout(function () {
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

function getDadesMapa(dades) {
  dadesmapa = JSON.parse(dades);
  longitud = dadesmapa.result.LONGITUD;
  latitud = dadesmapa.result.LATIUD;
  console.log("main, longitud, latitud: " + latitud + ", " + longitud);
}

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

  let body;

  request.on("response", (response) => {
    response.on("data", (chunk) => {
      body = `${chunk}`;
      //una vez que ha terminado la petición entonces, enviamos el JSON a nuestro renderer
      event.sender.send("enviar-casas", body);
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
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  let postData = JSON.stringify(info);

  request.setHeader("Authorization", "Bearer " + userToken);

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
