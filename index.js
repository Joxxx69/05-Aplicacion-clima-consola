require('dotenv').config();
const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
const colors = require('colors');
// 1800 100 100
// console.log(process.env.MAPBOX_KEY);
// console.log(process.env)


const main = async() => {
    let opt='';
    const busquedas = new Busquedas();
    do{
         opt = await inquirerMenu();
        switch (opt) {
            case '1': 
            // Mostrar mensaje
            const lugar = await leerInput('Ciudad: ');
            // Buscar los lugares
            const lugares= await busquedas.ciudad(lugar);
            // Seleccionar el lugar
            const id = await listarLugares(lugares);
            if(id ==='0'){continue;}
            // Guardar en DB
            const lugarSelec = lugares.find(lugarS => lugarS.id === id);
            busquedas.agregarHistorial(lugarSelec.nombre);
            // Clima

            const clima = await busquedas.climaLugar(lugarSelec.lat,lugarSelec.lng);

            // Mostrar resultados
            // console.clear();
            console.log('\n Informacion de la ciudad \n'.rainbow);
            console.log('Ciudad: ',lugarSelec.nombre);
            console.log('Lat: ', lugarSelec.lat);
            console.log('Lng: ', lugarSelec.lng);
            console.log('Temperatura: ',clima.temp);
            console.log('Minima: ',clima.min);
            console.log('Maxima: ',clima.max);

                break;
            case '2':
                busquedas.getHistorialCapitalizado.forEach((lugar,idx)=>{
                    console.log(`${idx+1+'.'.green} ${lugar}`);
                });

                break;
        }
        if(opt!=='0'){await pausa();}

        
    }while(opt !== '0');
}

main();