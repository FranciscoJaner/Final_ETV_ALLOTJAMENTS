//requires
const {app, BrowserWindow, webContents, session, Menu, ipcMain,} = require("electron");
const { menu } = require("./js/menu.js");
const { net } = require('electron')
const querystring = require("querystring");

//variable globals
let mainWindow;
let tokenKey;

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
  tokenKey = JSON.parse(tokens)
  tokenKey = tokenKey.data.token;
}

//renderers
ipcMain.on('login-data',(e,email,password)=>{
  //ahora tenemos que enviar la petición
  const request = net.request({
    method: "POST",
    hostname: 'www.etvtauladesfons.com',
    protocol: 'http:',
    path: '/api/login'
  });

  let body;

  let postData = JSON.stringify({
    'CORREU_ELECTRONIC' : `${email}`,
    'CONTRASENYA': `${password}`
  });

  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

    response.on('data', (chunk) => {
      body = (`${chunk}`);
      chargeToken(body)
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

  e.sender.send('login-finished');
})

/*ipcMain.on('load-content',function (e) {
  const request = net.request({//mirar si los datos son iguales
    method: "GET",
    hostname: 'etv.dawpaucasesnoves.com',
    protocol: 'http:',
    path: '/etvServidor/public/api/login'
  });

  let body;

  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

    response.on('data', (chunk) => {
      body = (`${chunk}`);
      chargeToken(body)
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
  request.end();
  e.sender.send('login-finished');
})*/

