const { app, Menu } = require("electron");

const isMac = process.platform === "darwin";

const template = [
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
      const { mainWindow } = require("./main.js");
      mainWindow.loadFile("index.html");
    },
  },
  {
    label: "LOGIN",
    click: async () => {
      const { mainWindow } = require("./main.js");
      mainWindow.loadFile("./HTML/form.html");
    },
  },
];

const menu = Menu.buildFromTemplate(template);
module.exports.menu = menu;
