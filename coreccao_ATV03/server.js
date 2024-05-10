//fazer isso para deixar mais rapido a API
import {createServer} from 'node:http'
import fs from 'node:fs'
import {URLSearchParams} from 'node:url'

import lerDadosReceitas from './lerReceitas.js'

const PORT = 3333

//COMANDOS BASICOS EM UMA CONSTRUÇÃO DA API(CLUD):
// C - CREAT
// R - REPLACE


const server = createServer((request, response)=>{
    const {method, url} = request

    //LISTAR
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
    //ADICIONAR
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
    //ATAULIZAR
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
    //DELETAR
    else if(method === 'DELETE' && url.startsWith ('/receitas/')){
        const id = parseInt(url.split('/') [2])
        lerDadosReceitas((err, receitas) =>{
            //aqui é o problema de servidor
            if(err) {
                response.writeHead(500, {'Contenr-Type' : 'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler dados'}))
                return //serve para parar a execução 
            }
            //findindex  funciona como se fosse um for, ele vai procurar o indece, o id da receita que seja deletada
            const indexReceitas = receitas.findIndex((receitas) => receitas.id === id)
            //Aqui é o erro do usuario
            if(indexReceitas == -1){
                response.writeHead(404, {'Contenr-Type' : 'application/json'})
                response.end(JSON.stringify({message: 'Receita não encontrada'}))
                return //serve para parar a execução 
            }
            //Parte que vai deletar a receita, antes era so erro
            //O splice() vai remover elementos
            receitas.splice(indexReceitas, 1)
            //wriFile serve para escrever as informações no arquivo.json, modificalo
            fs.writeFile("receitas.json",JSON.stringify(receitas, null, 2),(err) => {
                if(err){
                    response.writeHead(500, {'Contenr-Type' : 'application/json'})
                    response.end(JSON.stringify({message: 'Erro ao deletar receita do Banco de Dados'}))
                    return
                }
                response.writeHead(200, {"Content-Type" :"application/json"})
                response.end(JSON.stringify({message:'Receita excluida'}))
            })
        })

    }
    //PESQUISAR POR SO UMA RECEITA PELO ID
    else if(method === 'GET' && url.startsWith('/receitas')){
        const id = parseInt(url.split('/')[2])
        lerDadosReceitas((err, receitas) => {
            if(err){
                response.writeHead(500, {'Contet-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler o arquivo'}))
                return
            }
            const indexReceita = receitas.findIndex((receitas) => receitas.id === id)
            if(indexReceita == -1){
                response.writeHead(404, {'Contenr-Type' : 'application/json'})
                response.end(JSON.stringify({message: 'Receita não encontrada'}))
                return //serve para parar a execução 
            }
            const receitaEncontrada = receita[indexReceita]
            response.writeHead(200, {'Content-Type':'application/json'})
            response.end(JSON.stringify(receitaEncontrada))
        })
    }
    //CATEGORIAS
    else if(method === 'GET' && url.startsWith ('/categoria')){
        // localhost:3333/categoria
        response.end(method)
    }
    //BUSCA
    else if(method === 'GET' && url.startsWith ('/busca')){
        // localhost:3333/busca?termo=cebola
        // localhost:3333/busca?termo=Pratos%20Principais
        const urlParam = new URLSearchParams(url.split("?")[1])
        const termo = urlParam.get('termo')
        lerDadosReceitas((err, receitas) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler os dados'}))
                return
            }
            //filter, pois recietar é um array, e ele vai filtrar alguma informação que vc passsar, sempre retornando alguma coisa
            const resultadoDaBusca = receitas.filter((receita) => 
                receita.nome.includes(termo) ||
                receita.categoria.includes(termo) ||
                //Como  ingredientes é uma array, tem que fazer dessa forma 
                receita.ingredientes.some(((ingrediente) => ingrediente.includes(termo)))
            )
            if(resultadoDaBusca.length === 0){
                response.writeHead(404, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: `Não foi encontrada a receita que o usario procurotu pelo termo ${termo}`}))
                return
            }
            response.writeHead(200, {"Content-Type" : "application/json"})
            response.end(JSON.stringify(resultadoDaBusca))

        })
        
        
        
    }
    //INGREDIENTES
    else if(method === 'GET' && url.startsWith ('/ingredientes')){
       //localhost:333/ingredientes/pesquisa=cebola
        //trazer todas as receitas que possuem esse ingrediente
        const ingredientes = url.split("/")[2]
        fs.readFile("receitas.json", "utf8", (err, data) => {
            if (err) {
                response.writeHead(500, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Erro interno no servidor" }))
                return
            }
            const jsonData = JSON.parse(data)
            const ListarReceitasPorIngrediente = jsonData.filter((receita) => receita.ingredientes.includes(ingredientes))

            if (ListarReceitasPorIngrediente.length === 0) {
                response.writeHead(404, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Não existe receitas com esse ingrediente" }))
                return
            }
            response.writeHead(200, { "Content-Type": "application/json" })
            response.end(JSON.stringify(ListarReceitasPorIngrediente))
        })
       
    } 
    else{
        response.writeHead(404,{'Content-Type':'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }

})







server.listen(PORT, ()=> {
    console.log(`Servidor on PORT: ${PORT} 👽`)
})