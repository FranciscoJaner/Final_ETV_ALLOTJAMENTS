const { app, Menu } = require("electron");
const isMac = process.platform === "darwin";

// Menu inicial del menu sin iniciar sesion
const initial_menu = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }

  {
    label: "HOME",
    click: async () => {
      const { mainWindow } = require("../main.js");
      mainWindow.loadFile("./index.html");
    },
  },
  {
    label: "LOGIN",
    click: async () => {
      const { mainWindow } = require("../main.js");
      mainWindow.newTimer = false;
      mainWindow.loadFile("./HTML/loginform.html");
    },
  },
];

// Menu que sale cuando estas logueado.
const loged_menu = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }

  {
    label: "HOME",
    click: async () => {
      const { mainWindow } = require("../main.js");
      mainWindow.loadFile("./index.html");
    },
  },
  {
    label: "ADMINISTRATION",
    submenu: [
      {
        label: "NEW HOUSE",
        click: async () => {
          const { mainWindow } = require("../main.js");
          mainWindow.loadFile("./html/form_newhouse.html");
        },
      },
      {
        label: "UPDATE HOUSE",
        click: async () => {
          const { mainWindow } = require("../main.js");
          mainWindow.loadFile("./html/edit_own_house.html");
        },
      },
    ],
  },
  {
    label: "DASHBOARD",
    click: async () => {
      const { mainWindow } = require("../main.js");
      mainWindow.loadFile("./html/dashboard.html");
    },
  },
  {
    label: "MAP",
    click: async () => {
      const { mainWindow } = require("../main.js");
      mainWindow.loadFile("./html/map.html");
    },
  },
  {
    label: "LOG OUT",
    click: () => {
      const { mainWindow, logout } = require("../main.js");
      logout();
      mainWindow.loadFile("./index.html");
    },
  },
];

module.exports.menu = Menu.buildFromTemplate(initial_menu);
module.exports.menu2 = Menu.buildFromTemplate(loged_menu);
