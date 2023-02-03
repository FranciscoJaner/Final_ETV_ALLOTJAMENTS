const { ipcRenderer } = require ('electron')

//POINTERS
let email = document.getElementById('emailForm');
let passwd = document.getElementById('passwordForm');
let button = document.getElementById('button-login')
//event
button.addEventListener('click',function () {
    ipcRenderer.send('login-data',email.value,passwd.value);
})

//renderers

