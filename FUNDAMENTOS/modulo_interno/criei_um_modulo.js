
module.exports = {
    soma(a,b){
        console.log(`${a+b}`)
    },
    aoQuadrado(a){
        console.log (`${a*a}`)
    },
    subtracao(a,b){
        console.log(`${a-b}`)
    },
    divisao(a, b){
        if( b <= 0){
            console.log(`Erro ${b}`)
            return
        }
        console.log(`${a/b}`)
    },
    multiplicacao(a,b){
        console.log(a*b)
    }
}
