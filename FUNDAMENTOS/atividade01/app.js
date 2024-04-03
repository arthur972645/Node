//BAIXAR O MINIMIST

//RESUMO:   
// .Esse assutno conciste em a gente fazer a logica e testar 
// se ta certo no prorpio terminal e uma forma de ver isso é com
// minimist, dessa forma que esta abaixo, onde vc vai fazer a logica em
// uma parte externa, importar ela (modulo-soma.js), baixar e importar
// o minimist("minimist") e depois fazer uma logica para aparecer. Essa
// logica é feita com um array([numero1]) e a gente vai colocar pra esse array um valor


//Modulo exerno
const miminist = require("minimist")

//modulo interno
const soma = require('./modulo-soma').soma 

const args = miminist(process.argv.splice(2))
const a = args["numero1"]
const b = args["numero2"]

console.log(`A soma é de ${a} + ${b} = ${soma(a,b)}`)
//para realizar isso no terminal vc  usa o camando: node app.js --numero1=10 --numero2=10