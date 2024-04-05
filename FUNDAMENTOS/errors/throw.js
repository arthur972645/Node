

//Bloco de codigo para tratar instruções assincronas = que demoram a acontecer
// try{
//     //Aqui dentro a gnte sempre coloca instruções que demoram para acontecer
//     await WebGLShaderPrecisionFormat.event.creat({
//         data:{

//         }
//     })
// } catch (error){
//     console.log(error)
// }

//Versão resumida do try:
const b = '10'

if(!Number.isInteger(b)){
    console.log('O valor de B nao for um valor inteiro')
    //O throw new Erros vai parar a execussão do codigo quando for um error e vai explicar o error
    throw new Error('O valor de B nao for um valor inteiro')
}
console.log('reto dos codigos')