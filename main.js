//requires
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { menu } = require("./js/menu.js");
const { net } = require("electron");

//variable globals
let mainWindow;
let tokenKey;
let dadesmapa;
let latitud;
let longitud;
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

  Menu.setApplicationMenu(menu);
  mainWindow.loadFile("index.html");
  module.exports.mainWindow = mainWindow;
  mainWindow.webContents.openDevTools();
}
app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

function chargeToken(tokens) {
  tokenKey = JSON.parse(tokens);
  tokenKey = tokenKey.data.token;
  console.log(tokenKey);
}

function getDadesMapa(dades) {
  dadesmapa = JSON.parse(dades);
  longitud = dadesmapa.result.LONGITUD;
  latitud = dadesmapa.result.LATIUD;
  console.log("main, longitud, latitud: " + latitud + ", " + longitud);
}

//renderers
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

  //e.sender.send('login-finished');
});

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
