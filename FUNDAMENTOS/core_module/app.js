const path = require('path')

//Uma validação para permitir so um tipo de arquivo
const extesion = path.extname('arquivo.pdf')
console.log(extesion)