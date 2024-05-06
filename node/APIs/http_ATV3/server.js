import http from 'node:http'
import fs from 'node:fs'

const PORT = 3333

const server = http.createServer((request, response) => {
    const {method, url} = request



    fs.readFile("receitas.json","utf8", (err, data) => {
        if(err){
            response.writeHead(500, {'Content-Type':'application/json'})
            response.end(JSON.stringify({message: 'Erro ao buscar os dados'}))
            return;
        }

        let jsonData = []
        try{
            jsonData = JSON.parse(data)
        }catch(error){
            console.log('Erro ao ler o arquivo jsonData'+error)
        }

        //LISTAR TODOS AS RECEITAS
        if(url === '/receitas' && method === 'GET'){
           response.setHeader('Contet-Type','application/json')
           response.end(JSON.stringify('receitas.json'))
        }   
        //BUSCAR TODAS AS CATEGORIAS
        else if(url === ("/categoria") && method === 'GET'){
            console.log('GET /categorias:')
        }
        //BUSCAR COM BASE EM ingredientes
        else if(url === "/busca" && method === 'GET'){
            console.log('GET /busca')
        }
        //BUSCAR COM BASE NO INGREDIENTE:
        else if(url === "/ingredientes" && method === 'GET'){
            console.log('GET /ingredientes')
        }
        //BURCAR PELO ID:
        else if(url.startsWith("/receitas/") && method === 'GET'){
            console.log('GET /receitas/{id}')
        }
        //ADICIONAR NOVA RECEITA:
        else if(url === '/receita' && method === 'POST'){
            let body = ''
            request.on('data',(chunk) => {
                body += chunk
            })
            request.on('end', () => {
                const novaReceita = JSON.parse(body)
                novaReceita.id = jsonData.length + 1
                jsonData.push(novaReceita)

                fs.writeFile("empregados.json", JSON.stringify(jsonData, null, 2), (err) => {
                    if(err){
                        response.writeHead(500, {'Content-Type': 'application/json'})
                        response.end(JSON.stringify({message: 'Erro interno no servidor'}))
                        return
                    }
                    response.writeHead(201, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify(novaReceita))
                })
            })
        }
        //ATUALIZANDO RECEITAS:
        else if(url.startsWith('/receitas/') && method === 'PUT'){
            console.log('PUT /receitas/{id}:')
        }
        //DELETAR USUARIO: 
        else if(url.startsWith('/receitas/') && method === "DELETE"){
            console.log('DELETE /receitas/{id}:')
        }


    })
})
server.listen(PORT, () => {
    console.log(`Servidor on PORT: ${PORT}`)
})