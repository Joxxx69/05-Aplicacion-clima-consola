const inquirer = require('inquirer');
require('colors');
// console.clear();
const preguntas =[
    {
        type:'list',
        name:'opcion',
        message:'Que desea hacer?',
        choices:[
            {
                value:'1',
                name:`${'1.'.green} Buscar ciudad`
            },
            {
                value:'2',
                name:`${'2.'.green} Historial`
            },
            {
                value:'0',
                name:`${'0.'.green} Salir`
            }
        ]
    }
];
const inquirerMenu = async() => { 
    // console.clear();
    console.log('============================='.green);
    console.log('    Seleccione una opcion'.white);
    console.log('============================='.green);
    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}

const pausa = async() => {
    const pregunta=[
        {
            type:'input',
            name:'pausa',
            message:` Presione ${ 'Enter'.green} para continuar`
        }
    ]
    console.log('\n')
    await inquirer.prompt(pregunta);
}

const leerInput = async(message) => {
    const pregunta = [
        {
            type:'input',
            name:'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ]
    const {desc}= await inquirer.prompt(pregunta);
    return desc;
}

const listarLugares = async(lugares =[]) => {
    const choices = lugares.map((lugar,idx)=>{
        const indice =`${idx+1}`.green;
        return{
            value:lugar.id,
            name: `${indice} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value:'0',
        name: `${'0.'.green} Cancelar`
    })
    const preguntas =[
        {
            type:'list',
            name:'id',
            message:'Seleccione lugar: ',
            choices
        }
    ]
    const {id} = await inquirer.prompt(preguntas);
    return id
}

const confirmarPregunta = async(mensaje) => {
    const pregunta =[
        {
            type:'confirm',
            name:'ok',
            message:mensaje
        }
    ];
    const {ok} = await inquirer.prompt(pregunta);
    return ok;
}

const mostrarListadoCompletado = async(tareas =[]) => {
    const choices = tareas.map((tarea,idx)=>{
        const indice =`${idx+1}`.green;
        return{
            value:tarea.id,
            name: `${indice} ${tarea.descripcion}`,
            checked: (tarea.completado)? true:false
        }
    });

    const preguntas =[
        {
            type:'checkbox',
            name:'ids',
            message:'Selecciones',
            choices
        }
    ]
    const {ids} = await inquirer.prompt(preguntas);
    return ids;
    
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmarPregunta,
    mostrarListadoCompletado
}


