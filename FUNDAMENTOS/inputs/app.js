//BAIXAR O INQUERER


//ATIVIDADE MUITO BOA, ESTUDAR ELA EM CASAAAAA

const colors = require('colors')
//modulo externo que premite fazer um inputs
const inquirer = require('inquirer')

inquirer
    .prompt([
        {
            name:'p1',
            message:'Qual a primeira nota'
        },
        {
            name:'p2',
            message:'Quala segunda nota'
        }
    ])
    .then((nota) => {
        console.log(nota)
        const media = ((Number(nota.p1) + Number(nota.p2)) /2).toFixed(2)
        if(media >=6){
            console.log(`aprovado com media = ${media}`.bgGreen)
        }else{
            console.log(`reprovado com media = ${media}`.rainbow)
        }
    })
    .catch(err => console.log.error(err))