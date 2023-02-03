//requires
const {app, BrowserWindow, webContents, session, Menu, ipcMain,} = require("electron");
const { menu } = require("./JS/menu.js");
const { net } = require('electron')

//variable globals
let mainWindow;

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

//renderers
ipcMain.on('login-data',(e,email,password)=>{
  //ahora tenemos que enviar la petición
  const request = net.request({
    method: "POST",
    url: `http://etv.dawpaucasesnoves.com/etvServidor/public/api/login?email=${email}&password=${password}`,
  });
  let body = "";
  request.on("response", (response) => {
    // check response.statusCode to determine if the request succeeded
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

    // capture body of response
    // - can be called more than once for large result
    response.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
      body += chunk.toString();
    });

    // when response is complete, print body
    response.on("end", () => {
      console.log(`BODY: ${body}`);
    });
  });

  request.end();

})