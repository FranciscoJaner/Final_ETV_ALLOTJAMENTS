//requires
const {app, BrowserWindow, webContents, session, Menu, ipcMain,} = require("electron");
const { menu } = require("./js/menu.js");
const { net } = require('electron')
const querystring = require("querystring");

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
  console.log("Estoy en el main")

  const request = net.request({
    method: "POST",
    hostname: 'etv.dawpaucasesnoves.com',
    protocol: 'http:',
    path: '/etvServidor/public/api/login?'
  });

  let postData = JSON.stringify({
    'email' : `${email}`,
    'password': `${password}`
  });

  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    });
  });
  request.on('finish', () => {
    console.log('Request is Finished')
  });
  request.on('abort', () => {
    console.log('Request is Aborted')
  });
  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`)
  });
  request.on('close', (error) => {
    console.log('Last Transaction has occurred')
  });
  request.setHeader('Content-Type', 'application/json');
  request.write(postData, 'utf-8');
  request.end();
})