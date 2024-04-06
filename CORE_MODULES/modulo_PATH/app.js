// -Conceito e funcionalidades:
// .O módulo ‘path’ é uma das bibliotecas padrões presentes no Node.js, onde vai  possuir algumas funções que vão permitir trabalhar com caminhos de arquivos.

const path = require('path')

// pach.diarme() -> Retornar o nome do diretório inicial ( o nome no início )
const diarme = path.dirname('C:\Users\Alice\..\Documents\..\Downloads')
console.log(diarme)

// pach.basename() -> Retornar a última parte de um caminho ( o nome final ) 
const basename = path.basename('C/foo/bar/baz/asdf/quux.html')
console.log(basename)

// pach.extname() -> Retornar o tudo do último ponto em diante (.alguma coisa)
const extreme = path.extname('aquivo.js')
console.log(extreme)

// pach.resolve() -> Vai encontrar o caminho absoluto final a partir dos caminhos fornecidos
const resolve = path.resolve('modulo_PATH','app.js')
console.log(resolve)

// path.normalize() -> vai remover partes que não precisam, simplificando o caminho
const normaliza = path.normalize('C:\\Users\\Alice\\..\\Documents\\..\\Downloads')
console.log(normaliza)
