const fs = require('fs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');



var conf = {
    conexiones: [{
            id: 1,
            select: false,
            nombre: "FONACOT LOCAL",
            mysql: {
                crm: {
                    ip: "10.25.1.230",
                    usuario: "bswcrm_user",
                    contrasena: "Entrada2019$",
                    baseDatos: "siogen01",
                },
                cc: {
                    ip: "10.25.1.249",
                    usuario: "bswcc_user",
                    contrasena: "Entrada2019$",
                    baseDatos: "asteriskcdrdb",
                }
            },
            urls: {
                login: "http://10.25.1.230:8080/P8821/P821"
            }
        },
        {
            id: 2,
            select: false,
            nombre: "SEPOMEX LOCAL",
            mysql: {
                crm: {
                    ip: "192.168.220.231",
                    usuario: "bswcrm_user",
                    contrasena: "Entrada2019",
                    baseDatos: "siogen01",
                },
                cc: {
                    ip: "192.168.220.230",
                    usuario: "metricasmon",
                    contrasena: "EntradaMet2019/3",
                    baseDatos: "bstntrn",
                }
            },
            urls: {
                login: "http://192.168.220.231:8080/P8821/P821"
            }
        },
        {
            id: 3,
            select: false,
            nombre: "CRM 3",
            mysql: {
                crm: {
                    ip: "31.220.59.240",
                    usuario: "bswcrm_user",
                    contrasena: "Entrada2019$",
                    baseDatos: "siogen01",
                },
                cc: {
                    ip: "93.188.164.92",
                    usuario: "bswcc_user",
                    contrasena: "Entrada2019",
                    baseDatos: "asteriskcdrdb",
                }
            },
            urls: {
                login: "https://crm3.bsw.mx:8080/P8821/P821"
            }
        }
    ]
}


const conexiones = cryptr.encrypt(JSON.stringify(conf));

let cnn = {
    conexiones
};

let data = JSON.stringify(cnn);
fs.writeFileSync('cnn2020.json', data);