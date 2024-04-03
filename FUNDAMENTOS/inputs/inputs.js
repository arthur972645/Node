//CRIANDO  UM INPUT NO TERMINAL:
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})
readline.question('Digite seu nome: ',(nome)=>{
    console.log(`O nome do bisoho é: ${nome}`)
    readline.close()
})