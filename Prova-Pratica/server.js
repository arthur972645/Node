//Paciência e uma boa prova. Que a Força esteja com você!
import { v4 as uuidv4 } from 'uuid'; //Se não souber, não precisa usar.

import {createServer} from 'node:http'
import fs from 'node:fs'
import {URLSearchParams} from 'node:url'
import lerDadosPessoas from './lerDaddosPessoas.js';

const PORT = 3333

const server = createServer((request, response) => {
    const{method, url} = request
//LISTAR TODAS AS PESSOAS (1,0)
    if(method === 'GET' && url === '/pessoas'){
        lerDadosPessoas((err, pessoas) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler os dados'}))
                return
            }
            response.writeHead(200, {'Content-Type':'application/json'})
            response.end(JSON.stringify(pessoas))
        })
    }
//VER INFORMAÇÕES ESPECIFICAS PELO ID DA PESSOAS (2,0 )
    else if(method === 'GET' && url.startsWith('/pessoas/')){
        const id = parseInt(url.split('/')[2])
        lerDadosPessoas((err, pessoas) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler os dados'}))
                return
            }
            const pessoaIndice = pessoas.findIndex((pessoas) => pessoas.id === id)
            if(pessoaIndice === -1){
                response.writeHead(404, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Pessoa não encontrada'}))
                return
            }
            const pessoaEncontrada = pessoas[pessoaIndice]
            response.writeHead(200, {'Content-Type':'application/json'})
            response.end(JSON.stringify(pessoaEncontrada))
        })
    }
//CADASTEER PESSOAS com o nomo, idade e email (1,0)
    else if(method === 'POST' && url === '/pessoas'){
        let body = ''

        request.on('data', (chunk) => {
            body += chunk
        })
        request.on('end', () => {
            if(!body){
                response.writeHead(400, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Corpo da solicitação vazio'}))
                return
            }

            const novaPessoa = JSON.parse(body)

            lerDadosPessoas((err, pessoas) => {
                if(err){
                    response.writeHead(500, {'Content-Type':'application/json'})
                    response.end(JSON.stringify({message: 'Erro ao cadastrar pessoa'}))
                    return
                }
                novaPessoa.id = pessoas.length + 1
                pessoas.push(novaPessoa)

                 fs.writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err) => {
                    if(err){
                        response.writeHead(500, {'Content-Type':'application/json'})
                        response.end(JSON.stringify({message: 'Erro ao cadastrar pessoa no arquivo.json'}))
                        return
                    }
                    response.writeHead(201, {'Content-Type':'application/json'})
                    response.end(JSON.stringify(novaPessoa))
            
                
            })
                
            })
        })
    }
//CADASTAR ENDEREÇO PARA UM ID (1,0)
    else if(method === 'POST' && url.startsWith('/pessoas/endereco/')){
        const id = parseInt(url.split('/')[3])

        let body = ''

        request.on('data', (chunk) => {
            body += chunk
        })
        request.on('end', () => {
            if(!body){
                response.writeHead(400, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Corpo da solicitação vazio'}))
                return
            }

            const endereco = JSON.parse(body)
            
            lerDadosPessoas((err, pessoas) => {
                if(err){
                    response.writeHead(500, {'Content-Type':'application/json'})
                    response.end(JSON.stringify({message: 'Erro ao cadastrar endereço'}))
                    return
                }
                
                const IndicePessoa = pessoas.findIndex((pessoas) => pessoas.id === id)
                console.log(IndicePessoa)
                
                if(IndicePessoa === -1){
                    response.writeHead(404, {'Content-Type':'application/json'})
                    response.end(JSON.stringify({message: 'Pessoa não encontrada'}))
                    return
                }
                
               
                pessoas[IndicePessoa].push(pessoas)
                


                fs.writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err) => {
                    if(err){
                        response.writeHead(500, {'Content-Type':'application/json'})
                        response.end(JSON.stringify({message: 'Erro ao cadastrar pessoa no arquivo.json'}))
                        return
                    }
                    response.writeHead(201, {'Content-Type':'application/json'})
                    response.end(JSON.stringify(endereco))
                    
                
                })
            })
        })
    }







})
server.listen(PORT, () => {
    console.log(`Servidor on na PORTA ${PORT}`)
})

// 1.	POST /pessoas: (1,0)
// ○	Descrição: Esta rota permite que os usuários se cadastrem na plataforma.
// ○	Funcionalidade: Cadastro de Pessoa
// ○	Restrição: Não deve ser possível cadastrar pessoas com o mesmo email.
// ○	Método HTTP: POST
// ○	Corpo da Requisição: Deve conter nome, idade e email.
// 2.	POST /pessoas/endereco/{id_pessoa}:(1,0)
// ○	Descrição: Esta rota permite que os usuários cadastrem um endereço para uma pessoa específica.
// ○	Funcionalidade: Cadastro de Endereço
// ○	Restrição: Só deve cadastrar endereço em pessoa existente na base de dados.
// ○	Método HTTP: POST
// ○	Parâmetros da URL: ID da pessoa.
// ○	Corpo da Requisição: Deve conter rua, número, cidade, estado e CEP.
// 3.	POST /pessoas/telefones/id_pessoa}:(1,0)
// ○	Descrição: Esta rota permite que os usuários cadastrem telefones para uma pessoa específica.
// ○	Funcionalidade: Cadastro de Telefone
// ○	Restrição: Só deve cadastrar endereço em pessoa existente na base de dados.
// ○	Método HTTP: POST
// ○	Parâmetros da URL: ID da pessoa.
// ○	Corpo da Requisição: Deve conter tipo de telefone (celular, residencial, comercial) e número.

// 4.	GET /pessoas/{id_pessoa}:(2,0)
// ○	Descrição: Esta rota permite visualizar as informações de uma pessoa específica.
// ○	Funcionalidade: Visualização de Pessoa
// ○	Método HTTP: GET
// ○	Parâmetros da URL: ID da pessoa.
// ○	Resposta: Nome, idade, email, endereço e telefone da pessoa.

// 5.	PUT /pessoas/endereco/{id_pessoa}:(2,0)
// ○	Descrição: Esta rota permite atualizar o endereço de uma pessoa específica.
// ○	Funcionalidade: Atualização de Endereço
// ○	Método HTTP: PUT
// ○	Parâmetros da URL: ID da pessoa.
// ○	Corpo da Requisição: Pode conter rua, número, cidade, estado e/ou CEP.

// 6.	DELETE /pessoas/telefones/{id_pessoa}:(2,0)
// ○	Descrição: Esta rota permite deletar um telefone específico de uma pessoa.
// ○	Funcionalidade: Deletar de Telefone
// ○	Método HTTP: DELETE
// ○	Parâmetros da URL: ID da pessoa.
// ○	Corpo da Requisição: Pode conter tipo e/ou número.

// 7.	GET /pessoas: (1,0)
// ○	Descrição: Esta rota permite visualizar todas as pessoas cadastradas na plataforma.
// ○	Funcionalidade: Listagem de Pessoas
// ○	Método HTTP: GET
