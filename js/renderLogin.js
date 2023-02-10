const { ipcRenderer } = require ('electron')

//POINTERS
let email = document.getElementById('emailForm');
let passwd = document.getElementById('passwordForm');
let button = document.getElementById('button-login')
//event

ipcRenderer.on('verificacion',function (event, args) {
    if (args)
    {
        button.addEventListener('click',function () {
                ipcRenderer.send('login-data',email.value,passwd.value);
        })
    }
})
//renderers

ipcRenderer.on('login-finished',function (e) {
    console.log('hemos llegado al renderer con el token')
    e.sender.send('load-content');
})


