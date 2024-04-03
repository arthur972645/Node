//baixar o minimist

const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))
console.log(argv)
const nome = argv["nome"]
console.log(nome)
const idade = argv['idade']
console.log(`Nome ${nome} e idade ${idade} anos`)