//this file charge the graphs in the dashboard
const { ipcRenderer } = require("electron")
const {Chart} = require('chart.js/auto');
let $ = {jQuery} = require('jquery');

//selectores
let graphic1 = document.getElementById('graphic-1');
let graphic2 = document.getElementById('graphic-2');
let graphic3 = document.getElementById('graphic-3');
let graphic4 = document.getElementById('graphic-4');

//variables con los gráficos
let informacion;
let myChart1;
let myChart2;
let myChart3;
let myChart4;

ipcRenderer.send('load-content-dashboard','e');

//nos comunicaremos con el mainProcess para hacer que nos devuelva la información de la api
ipcRenderer.on('enviar-info-casas',function (e, infoCasas){
    informacion = JSON.parse(infoCasas).data;
    graph1()
    graph2()
    graph3()
    graph4()
})

//ejecutamos los gráficos al recibir la información
function graph1(){
    if (myChart1) {
        myChart1.destroy();
    }

    myChart1 = new Chart(graphic1, {
        type: 'bar',
        data: {
            labels: informacion.map((element) => element.nom),
            datasets: [{
                label: 'Numero de personas por casa',
                data: informacion.map((element) => element.npersones),
                backgroundColor: '#FF3933',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Número de huespedes por casas'
                }
            }
        }
    });
}
function graph2(){
    if (myChart2) {
        myChart2.destroy();
    }

    myChart2 = new Chart(graphic2, {
        type: 'bar',
        data: {
            labels: informacion.map((element) => element.nom),
            datasets: [{
                label: 'Numero de baños por casa',
                data: informacion.map((element) => element.nbanys),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Número de baños por casas'
                }
            }
        }
    });
}
function graph3(){
    if (myChart3) {
        myChart3.destroy();
    }

    myChart3 = new Chart(graphic3, {
        type: 'doughnut',
        data: {
            labels: informacion.map((element) => element.nom),
            datasets: [
                {
                    label: "Mejor valorados",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: informacion.map((element) => element.valoracio)
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: `Valoraciones`
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Valoraciones de las casas'
                }
            }
        }
    });
}
function graph4 (){
    if (myChart4) {
        myChart4.destroy();
    }

    myChart4 = new Chart(graphic4, {
        type: 'doughnut',
        data: {
            labels: informacion.map((element) => element.nom),
            datasets: [
                {
                    label: "Número de habitaciones",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: informacion.map((element) => element.nhabitacions)
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: `Número de habitaciones`
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Número de habitaciones por cada inmueble'
                }
            }
        }
    });
}
