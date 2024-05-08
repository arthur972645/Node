//fazer isso para deixar mais rapido a API
import {createServer} from 'node:http'
import fs from 'node:fs'
import {URLSearchParams} from 'node:url'

import lerDadosReceitas from './lerReceitas.js'
import { deepStrictEqual } from 'node:assert'

const PORT = 3333



const server = createServer((request, response)=>{
    const {method, url} = request


    if(method === 'GET' && url === '/receitas'){
        lerDadosReceitas((err, receitas) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler os dados'}))
                return
            }
            response.writeHead(200, {'Content-Type':'application/json'})
            response.end(JSON.stringify(receitas))
        })
       
    }
    else if(method === 'POST' && url === '/receitas'){
   
        let body = ''
        request.on("data", (chunk) => {
            body += chunk;      
        })
        request.on("end", () => {
            if(!body){
                response.writeHead(400,{'Content-Type':"application/json"})
                response.end(JSON.stringify({message:'Corpo da soliticação vazio'}))
                return
            }

            const novaReceita = JSON.parse(body)

            console.log('AQUI')
            lerDadosReceitas((err, receitas) => {
                if(err){
                    response.writeHead(500,{'Content-Type':"application/json"})
                    response.end(JSON.stringify({message:'Erro ao cadastrar a receita'}))
                    return
                }
                novaReceita.id = receitas.length + 1
                receitas.push(novaReceita)
                console.log(receitas)

                fs.writeFile('receitas.json', JSON.stringify(receitas, null, 2), (err) =>  {
                    if(err){
                        response.writeHead(500,{'Content-Type':"application/json"})
                        response.end(JSON.stringify({message:'Erro ao cadastrar a receita no arquivo'}))
                        return
                    }
                })
                
                response.writeHead(201,{'Content-Type':"application/json"})
                response.end(JSON.stringify(novaReceita))
                
            })
        })
    }
    else if(method === 'PUT' && url.startsWith ('/receitas/')){    
        const id = parseInt(url.split('/')[2])
        let body = ''

        request.on('data', (chunk)=>{
            body += chunk
        })
        request.on('end', ()=>{
            if(!body){
                //Para verificar se o campo está vazio
                response.writeHead(400, {'Content-Type': 'application/json'})
                response.end(JSON.stringify({message: 'Corpo da solicitação está vazio'}))
                return
            }
            lerDadosReceitas((err, receitas)=>{
                if(err){
                    response.writeHead(500, {'Content-Type':'application/json'})
                    response.end(JSON.stringify({message: 'Erro ao cadastrar receita'}))
                    return;
                    //500: Erro de servidor
                }

                const indexReceita = receitas.findIndex((receita)=> receita.id === id)

                if(indexReceita === -1){
                    response.writeHead(404, {'Content-Type' : 'application/json'})
                    response.end(JSON.stringify({message: 'Receita não encontrada'}))
                    return;
                }
                const receitaAtualizada = JSON.parse(body)
                receitaAtualizada.id = id

                receitas[indexReceita]= receitaAtualizada

                fs.writeFile('receitas.json', JSON.stringify(receitas, null, 2), (err)=>{
                    if(err){
                        response.writeHead(500, {'Content-Type' : 'application/json'})
                        response.end(JSON.stringify({message: 'Não é possível atualizar a receita'}))
                        return; 
                    }
                    response.writeHead(201, {'Content-Type' : 'application/json'})
                        response.end(JSON.stringify(receitaAtualizada))
                })
            })

        })
    }

    else if(method === 'DELETE' && url.startsWith ('/receitas/')){
        response.end(method)
    }
    else if(method === 'GET' && url.startsWith ('/receitas')){
        response.end(method)
    }
    //CATEGORIAS
    else if(method === 'GET' && url.startsWith ('/categoria')){
        // localhost:3333/categoria
        response.end(method)
    }
    //BUSCA
    else if(method === 'GET' && url.startsWith ('/busca')){
        // localhost:3333/busca?termo=cebola
        // localhost:3333/busca?termo=Pratos20Principais
        response.end(method)
    }
    //INGREDIENTES
    else if(method === 'GET' && url.startsWith ('/ingredientes')){
        // localhost:3333/ingredientes
        response.end(method)
    } 
    else{
        response.writeHead(404,{'Content-Type':'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }

})







server.listen(PORT, ()=> {
    console.log(`Servidor on PORT: ${PORT}`)
})