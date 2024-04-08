const http = require('node:http');

const server = http.createServer((request, response)=>{
    response.write('ablubluble, primero server HTTP.');
    response.end();
});

server.listen(3333, ()=>{
    console.log('Sevidor on PORT: 3333.');
});


