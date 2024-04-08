const http = require('node:http')
const POST = 0807

const server = http.createServer((request, response) => {
    if(request.url === '/'){
        response.writeHead(200, {"Content-Type" : "text/html"})
        response.write("<meta charset=utf8>")
        response.write("<h1> PÁGINA INICIAL </h1>")
        response.end()
    }else if(request.url === '/home'){
        response.writeHead(200, {"Content-Type" : "text/html"})
        response.write("<meta charset=utf8>")
        response.write("<h1> Bem-vindo à página inicial! </h1>")
        response.end()
    }else if(request.url === '/about'){
        response.writeHead(200, {"Content-Type" : "text/html"})
        response.write("<meta charset=utf8>")
        response.write("<h1>Sobre nós: somos uma empresa dedicada a...</h1>")
        response.end()
    }else{
        response.writeHead(404, {"Content-Type" : "text/html"})
        response.write("<meta charset=utf8>")
        response.write("<h1>Page não encontrada</h1>")
        response.end()
    }
})

server.listen(POST, () =>{
    console.log(`Servidor on ${POST}`)
})