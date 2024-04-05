//Sicrona - Estatisca
//Uma funcao ASSINCRONA é uma fucao usada quando precisa fazer alguma coisa e essa coisa demora 
//um tempo pra ser feita, sempre nessa situação usada uma função ASSINCRONA!!

//Para o node mais atualizado:
// const fs = require('noce:fs')

const fs = require('fs')

console.log('start')

//Esse Sync indica que é uma função assincrona, onde esperar 
//ela ser feita para ai sim ir para outra linha do codigo
fs.writeFileSync('Arquivo1.txt', 'Olá')
console.log('End')
