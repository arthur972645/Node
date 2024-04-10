//DESENVOLVIMENTO DE UMA API:
//Métodos do http: GET, POST, PUT, PATH, DELETE
/*

REQUISIÇÃO: 
1. corpo da requisição (request.body) - (POST)
2. Paramentro de busca (Search PARAMS, QUEY PARAMES) - (GET)
http://localhost:3333/user/2
3. Parametros de ROTA, quando vc precisa passar uma informação ou
exclui um dadao(ROUTE PARMS) - (PUT, PATH, DELETE)
http://localhost:3333/user/1
*/

import { NONAME } from 'node:dns'
import http from 'node:http'

const PORT = 3333

const users = []

const server = http.createServer((request, response) => {
    const {method, url} = request

    if(url === '/users' && method === "GET"){//Buscar todos os usuários
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(users))
    }
    else if(false){//buscar um uniico usuasrio
    }else if (url === '/users' && method === "POST"){ //cadastrando um usuario
        let boby = ''
        request.on('data',(chunk) => {
            boby += chunk.toString()
        })
        request.on('end',() => {
            const novoUsuario = JSON.parse(boby)
            novoUsuario.id = '1'
            users.push(novoUsuario)

            response.writeHead(201, {'Content-Type' : 'application/json'})
            response.end(JSON.stringify(novoUsuario))
        })
    } 
})

server.listen(PORT, () => {
    console.log(`Servidor on PORT: ${PORT}`)
})