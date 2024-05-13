import {createServer} from 'node:http'
import fs from 'node:fs'
import { URLSearchParams } from 'node:url'
import lerDados from './lerDados.js'

const PORT = 3333

const serve = createServer((request, response) => {
    const{method, url} = request
    
    //LISTAR    
    if(url === '/usuarios' && method === 'GET'){
        lerDados((err, usuario) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message:'Erro ao ler os dados'}))
                return
            }
            response.writeHead(200, {'Content-Type':'application/json'})
            response.end(JSON.stringify(usuario))
        })
    }
    //DADOS DE UM USUARIO
    else if(url.startsWith('/perfil/') && method === 'GET'){
        const id = parseInt(url.split('/')[2])
        lerDados((err, usuario) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application'})
                response.end(JSON.stringify({message:'Erro ao ler o aquivo'}))
                return
            }
            const  indexUsuario = usuario.findIndex((usuario) => usuario.id === id)
            if(indexUsuario === -1){
                response.writeHead(404, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message:'Receita não encontrada'}))
                return
            }
            const usarioEncontrado = usuario[indexUsuario]
            response.writeHead(200, {'Content-Type':'application/json'})
            response.end(JSON.stringify(usarioEncontrado))
        })
    }
    //FAÇA UPLOAD DE UMA NOVA IMAGEM
    else if(url === '/perfil/imagem' && method === 'POST'){
        console.log(method)
        return
    }
    //CADASTRAR UM NOVO USUARIO
    else if(url === '/usuarios' && method === 'POST'){
        let body = ''
        request.on("data",(chunk) => {
            body += chunk
        })
        request.on('end', () => {
            if(!body){
                response.writeHead(400, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message:'Corpo da solicitação vazio'}))
                return
            }
            const novoUsuario =JSON.parse(body)
            
            lerDados((err, usuario) => {
                if(err){
                    response.writeHead(500,{'Content-Type':"application/json"})
                    response.end(JSON.stringify({message:'Erro ao cadastrar a usuario '}))
                    console.log(novoUsuario)
                    return
                }
                novoUsuario.id = usuario.length + 1
                usuario.push(novoUsuario)

                fs.writeFile('usuarios.json', JSON.stringify(usuario, null, 2),(err) => {
                    if(err){
                        response.writeHead(500,{'Content-Type':'application/json'})
                        response.end(JSON.stringify({message:'Erro ao cadastrar a usuario no arquivo'}))
                        return
                        
                    }
                    if(novoUsuario.Email === novoUsuario.ConfirmarEmail){
                        response.writeHead(404,{'Content-Type':'application/json'})
                        response.end(JSON.stringify({message:'Erro ao cadastrar a usuario, EMAIL igual'}))
                        return
                    } else{
                        response.writeHead(201,{'Content-Type':"application/json"})
                        response.end(JSON.stringify(novoUsuario))
                    }
                })
                
                
                

            })
        })
    }
    //LOGIN DO USUARIO
    else if(url === '/login' && method === 'POST'){
        console.log(method)
        return
    }
    //ATUALIZAR PERFIL
    else if(url === '/perfil' && method === 'PUT'){
        console.log(method)
        return
    } 
    //DELETAR USUARIO
    else if(url.startsWith('/usuarios/') && method === 'DELETE'){
        console.log(method)
        return
    }
   else{
        response.writeHead(404,{'Content-Type':'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }


})


serve.listen(PORT, () => {
    console.log(`Servidor on PORT ${PORT}`)
})