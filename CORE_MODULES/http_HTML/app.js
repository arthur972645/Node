
//DEVOLVER UM HTML PARA O USUARIO:
const http  = require('node:http')
const PORT = 3333

const server = http.createServer((request, response) => {
    if(request.url === "/"){
        response.writeHead(200, {"Content-Type" : "text/html"})
        //esse meta... serve para nao deixar o html ruim, faz interpretar certinho
        response.write("<meta charset=utf8>")
        response.write("<p>PRIMERIA PAGINA</p>")
        response.end()
    }else if(request.url === '/sobre'){
        response.writeHead(200, {"Content-Type" : "text/html"})
        response.write("<meta charset=utf8>")
        response.write("<p>SEGUNDA PAGINA</p>")
        response.end()
    }else{
        response.writeHead(404, {"Content-Type" : "text/html"})
        response.write("<meta charset=utf8>")
        response.write("<h1>Page não encontrada</h1>")
        response.end()
    }
})
server.listen(PORT, () => {
    console.log(`Sevidor on ${PORT}`)
})