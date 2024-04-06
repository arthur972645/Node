// Suponha que você está construindo um sistema de gerenciamento de arquivos onde os usuários podem especificar caminhos para diferentes diretórios e arquivos. No entanto, os usuários podem inadvertidamente inserir caminhos com vários espaços em branco ou pontos redundantes. Por exemplo, um usuário pode inserir "C:\meus..\documentos\relatórios..\relatórios_finais\documento.txt", que contém pontos redundantes e uma parte ".." que poderia ser simplificada.


// Seu objetivo é criar uma função que normalize esses caminhos de forma que eles não contenham pontos redundantes ou partes que podem ser simplificadas.

// Caminhos devidamente inseridos
// const paths = [
//   "/usr/local/../local/bin",
//   "C:\\Users\\Alice\\..\\Documents\\..\\Downloads",
//   "C:/Program Files/./Node.js",
//   "/home/user/././././workspace/../project",
// ];


// Saída do programa:
// /usr/local/bin
// C:\Users\Alice\..\Documents\..\Downloads
// C:/Program Files/Node.js
// /home/user/project

const path = require('path')

//função que vai normalizar o aquivoErrado
const verificarCaminho = (arquivoErrado) => {
    console.log(arquivoErrado)
    //COmo é um array e a gente vai modificar ele, a gente coloca o .map e depois indica pro path o que vai ser normalizado, que no caso é o arquivo errado
    //depois de nornalizar coloca para aparecer no console
    const normalizar = arquivoErrado.map(arquivoErrado => path.normalize(arquivoErrado))
    
    console.log(normalizar)

}

const arquivoErrado = [
    "/usr/local/../local/bin",
    "C:\\Users\\Alice\\..\\Documents\\..\\Downloads",
    "C:/Program Files/./Node.js",
    "/home/user/././././workspace/../project",
];

//como a gente chamou o console na função, aqui si é preciso chamar a função com o parametro
//quando eu coloco aqui embaixo esse paramentro, ele vai ser o mesmo na função acima independendo do nome
verificarCaminho(arquivoErrado)
