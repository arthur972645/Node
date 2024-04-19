const fs = require('fs'); // Remova o prefixo 'node:' do módulo 'fs'
const http = require('http');
const PORT = 3333;

const server = http.createServer((request, response) => {
    //Ler um arquivo em html:
    fs.readFile('index.html', (err, data) => {
        if(err) {
            throw new Error('Erro ao ler arquivo');
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data); // Corrija para response.write para enviar os dados lidos
        return response.end();
    });
});

server.listen(PORT, () => {
    console.log('Servidor on na porta ' + PORT);
});
