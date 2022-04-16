const fs =require('fs');
const axios = require('axios');
const urlUsuarios = 'https://reqres.in/api/users?page=2';
const mapbox ='https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?limit=5&language=es&access_token=pk.eyJ1Ijoiam94eHg2OSIsImEiOiJjbDF5ODBvNnYwYTYzM2txZjJvcXRsdzV5In0.QVOxO5HQeGjVAgcdYEoI4g';


class Busquedas{
    historial = [];
    dbPath='./db/database.json';
    constructor(){
        this.leerDB();
    }
    async ciudad(lugar=''){
        //peticion http
        try {
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params:this.getParamsMapbox
            });
            const {data} = await instance.get();
            return data.features.map(sitio=>({
                id: sitio.id,
                nombre: sitio.place_name,
                lng:sitio.center[0],
                lat: sitio.center[1]
            }))

            // const {data:datos} = await axios.get(mapbox);
            // console.log(datos);
            // return [];
        } catch (error) {
            return [];
        }
    }
    async climaLugar(lat,lon){
        try {
            // instancia de axios
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{...this.getParamsWeather,lat,lon}
            });
            const {data} = await instance.get();
            const {weather, main} =data;
            
            // resp --> estraer la informacion
            return{
                desc:weather[0].desciption,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }
    agregarHistorial(lugar=''){
        // TODO: prevenir duplicidad
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en la base de datos
        this.guardarDB();
    }
    guardarDB(){
        const payloaad={
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath,JSON.stringify(payloaad));
    }
    leerDB(){
        // Debe de existir
        if(!fs.existsSync(this.dbPath)){return;}
        
        const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
    get getHistorialCapitalizado(){
        // Capitalizar las palabras 
        return this.historial.map(lugar=>{
            let palabras = lugar.split(',');
            palabras.map(palabra=> {
                palabra[0].toUpperCase() + palabra.substring(1);
            });
            return palabras.join('');
        })
    }

    get getParamsMapbox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }
    get getParamsWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang:'es'
        }
    }

}
module.exports=Busquedas;