const meuModulo = require('./criei_um_modulo')
console.log(meuModulo)

//chamando o modulo de soma
const soma = meuModulo.soma
soma(50, 50)

// chamando o modulo de número ao quadrado.
const aoQuadrado = meuModulo.aoQuadrado
aoQuadrado(10)

//chamando o modulo de subtração.
const subtracao = meuModulo.subtracao
subtracao(200, 100)

//chamando o modulo de divisão.
const divisao = meuModulo.divisao
divisao(200, 2)

//chamando o modulo de multiplicação.
const multiplicacao = meuModulo.multiplicacao
multiplicacao(50, 2)