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
    //Verificação dos metodos e da url a ser utilizada
    if(method === 'GET' && url === '/receitas'){
        /*chamos o lerDadoReceita, que um arquivo externo, onde nele
        tem o modulo fs, que server para manipular qrquivos externos, como o
        arquivo json, para pordermosa avaliar, verificar se ta tud ocerto, se nao tiver
        retorna um erro, se tiver ele passa*/
        lerDadosReceitas((err, receitas) => {
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler os dados'}))
                return
            }
            /* O writeHead serve para definir os status da resposta HTTP
            Imagina quando vc coloca o seu site na parte de action do git hub e as
            vezes aparece erro 404, que fez isso foi o writeHead*/
            response.writeHead(200, {'Content-Type':'application/json'})
            /*O response.end, finaliza a operação, MUITO IMPORTATNE */
            response.end(JSON.stringify(receitas))
        })
       
    }
    //ADICIONAR
    else if(method === 'POST' && url === '/receitas'){
   
        let body = ''//variavel que vai armazenas o corpo da requisição, ou seja, a nova receita
        request.on("data", (chunk) => { // ecento disparado quando um novo dado é recebido, onde ele é adicionado a varaivel, que é o body
            body += chunk;      
        })
        request.on("end", () => { //Mais um evento disparado quando um dado for recebido e se o corpo da requisição(body) estiver sem nada por algum motivo, disparado um erro
            if(!body){//virificando se o corpo ta vazio ou nao, ou seja, se eu colocar para adcionar algo, e não escrever nada, é esse erro que vai aparecer
                response.writeHead(400,{'Content-Type':"application/json"})
                response.end(JSON.stringify({message:'Corpo da soliticação vazio'}))
                return
            }

            const novaReceita = JSON.parse(body) // pego o dado do body e converto para objeto

            
            lerDadosReceitas((err, receitas) => { //Como no arquivo lerDadosReceitas, estamos trabalahndo diretamente com o arquivo .JSON, ao adiconar uma receita, precisamos chamar esse aquivo lerDadosReceitas
                if(err){//erro caso nao seja possivel cadastrar a receita
                    response.writeHead(500,{'Content-Type':"application/json"})
                    response.end(JSON.stringify({message:'Erro ao cadastrar a receita'}))
                    return //sempre colocar para encerraar e execução
                }
                //define o novo id da receita, antes dela ser adicionada, lembre-se que o 'receitas' é equivalente a tudo que ta no arquivo json, é um array 
                novaReceita.id = receitas.length + 1
                receitas.push(novaReceita)//adicionamos a nova receita ao array receitas
                console.log(receitas)

                //o fs.writeFile vai servir para escrever o novo dado no aquivo receitas.json
                fs.writeFile('receitas.json', JSON.stringify(receitas, null, 2), (err) =>  {
                    if(err){//erro caso nao consiga ser escrita no arquivo.json, pois cadastrada ela ja foi
                        response.writeHead(500,{'Content-Type':"application/json"})
                        response.end(JSON.stringify({message:'Erro ao cadastrar a receita no arquivo'}))
                        return
                    }
                })
                
                response.writeHead(201,{'Content-Type':"application/json"}) //Define o cabeçalho da resposta com status 201 (criado) e tipo de conteúdo JSON
                response.end(JSON.stringify(novaReceita)) // Envia a nova receita como JSON na resposta
                
            })
        })
    }
    //ATAULIZAR
    else if(method === 'PUT' && url.startsWith ('/receitas/')){    
        const id = parseInt(url.split('/')[2]) // por se trater de uma coisa especifica, vamos pegar o valor que estara depois do '/', que no caso seria o id
        //mesmo esquema do de ataulizar
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
            lerDadosReceitas((err, receitas)=>{//chama a função que ta mexendo diretamente com o aquivo.json e ler ela e verifica de aparaceu algum erro ou nao
                if(err){
                    response.writeHead(500, {'Content-Type':'application/json'})
                    response.end(JSON.stringify({message: 'Erro ao cadastrar receita'}))
                    return;
                    //500: Erro de servidor
                }
                //nao apareceu nenhum erro entao segue o baile
                
                const indexReceita = receitas.findIndex((receita)=> receita.id === id) //como agora estamos 'dentro' do lerDadosreceitas,e o arquivo json é um array chamado receitar, precisamos achar qual é o indice referente ao id que colocarmos e atribui isso a uma varivel

                if(indexReceita === -1){ //verificar se a receita nao foi encontrada, ou seja, o indice, pois quando nao é encontrada ela retorna -1
                    response.writeHead(404, {'Content-Type' : 'application/json'})
                    response.end(JSON.stringify({message: 'Receita não encontrada'}))
                    return;
                }
                const receitaAtualizada = JSON.parse(body) //converte o corpo da requisição de json para objeto
                receitaAtualizada.id = id //mantem o id  da receita que vai ser atualizada

                receitas[indexReceita]= receitaAtualizada // Atualiza a receita no array

                //mostar a receita atualizada no arquivo.json
                fs.writeFile('receitas.json', JSON.stringify(receitas, null, 2), (err)=>{
                    if(err){
                        response.writeHead(500, {'Content-Type' : 'application/json'})
                        response.end(JSON.stringify({message: 'Não é possível atualizar a receita'}))
                        return; 
                    }
                    response.writeHead(201, {'Content-Type' : 'application/json'}) // Define o cabeçalho da resposta com status 201 (criado) e tipo de conteúdo JSON
                    response.end(JSON.stringify(receitaAtualizada)) //estamos finalizando a resposta/operação, Enviando a receita atualizada como JSON na resposta
                })
            })

        })
    }
    //DELETAR
    else if(method === 'DELETE' && url.startsWith ('/receitas/')){
        const id = parseInt(url.split('/') [2]) //vai pegar o id de usuario que quero deletas
        lerDadosReceitas((err, receitas) =>{ //vai pegar todos os dados adicionados e ler eles, e ver se tem algum erro
            //aqui é o problema de servidor
            if(err) {
                response.writeHead(500, {'Contenr-Type' : 'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler dados'}))
                return //serve para parar a execução 
            }
            //findindex  funciona como se fosse um for, ele vai procurar o indece, o id da receita que seja deletada
            const indexReceitas = receitas.findIndex((receitas) => receitas.id === id)
            //Aqui é o erro do usuario
            if(indexReceitas == -1){//caso ele procure e nao ache nenhum indice para aquele id, ele retorna o indice -1, ou seja, nada, com isso a hente faz essa validação de erro para saber se encontrou ou nao
                response.writeHead(404, {'Contenr-Type' : 'application/json'})
                response.end(JSON.stringify({message: 'Receita não encontrada'}))
                return //serve para parar a execução 
            }
            //Parte que vai deletar a receita, antes era so erro
            //O splice() vai remover elementos
            //pega  o array receitas, coloca o .splice, pois é pra remover e indica qual indice vai remover
            receitas.splice(indexReceitas, 1)
            //wriFile serve para escrever as informações no arquivo.json
            fs.writeFile("receitas.json",JSON.stringify(receitas, null, 2),(err) => {
                if(err){
                    response.writeHead(500, {'Contenr-Type' : 'application/json'})
                    response.end(JSON.stringify({message: 'Erro ao deletar receita do Banco de Dados'}))
                    return
                }
                //caso nao de problema em escrever, no casa reescrever, pois vamos estar tirando do 'receitas.json', a gente finaliza a opereção aqui
                response.writeHead(200, {"Content-Type" :"application/json"})
                response.end(JSON.stringify({message:'Receita excluida'}))
            })
        })

    }
    //PESQUISAR POR SO UMA RECEITA PELO ID
    else if(method === 'GET' && url.startsWith('/receitas/')){
        const id = parseInt(url.split('/')[2]) // pegando o valor do id que colocamos
        lerDadosReceitas((err, receitas) => {//chamando a função que esta manipulando... o 'receitas.json'
            if(err){//verificando se ta tudo certo
                response.writeHead(500, {'Contet-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler o arquivo'}))
                return//parara execução
            }
            const indexReceita = receitas.findIndex((receitas) => receitas.id === id) //pegando o indice do id que colocamos
            if(indexReceita == -1){//validando pra saber se achamos ou nao
                response.writeHead(404, {'Content-Type' : 'application/json'})
                response.end(JSON.stringify({message: 'Receita não encontrada'}))
                return //serve para parar a execução 
            }
            const receitaEncontrada = receitas[indexReceita] //se acharmos vamos chamar a a 'receitas', que é o array e especificar o que queremos que no caso é o indice que encontramos e atribuimos a uma variavel
            //finalizamos a operação aqui
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
    else if(method === 'GET' && url.startsWith ('/busca?')){
        // localhost:3333/busca?termo=Pratos%20Principais
        const urlParam = new URLSearchParams(url.split("?")[1])// vai pegar os dados depois da ? e os transforma-los em um objeto
        const termo = urlParam.get('termo')// pega o dado acima, ou seja, o objeto, e pega somento o valor de termo(OLHA NO EXEMPLO ACIMA)
        lerDadosReceitas((err, receitas) => { // Chama a função lerDadosReceitas para ler as receitas do arquivo JSON
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro ao ler os dados'}))
                return
            }
            //filter, pois recietar é um array, e ele vai filtrar alguma informação que vc passsar, sempre retornando alguma coisa e em forma de array
            const resultadoDaBusca = receitas.filter((receita) => 
                receita.nome.includes(termo) || // vou filtrar se em todas as receitas.nome tem o termo que eu quero
                receita.categoria.includes(termo) || //vou filtar se em todas as recetias.categorias tem o termo que eu pesquisei
                //Como  ingredientes é uma array, tem que fazer dessa forma 
                receita.ingredientes.some(((ingrediente) => ingrediente.includes(termo))) // vou filtar se em ingredientes tem o termo que eu pesquisei
            )
            if(resultadoDaBusca.length === 0){ //se retonar um aray vazio quer dizer que nada foi achado 
                response.writeHead(404, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: `Não foi encontrada a receita que o usario procurotu pelo termo ${termo}`}))
                return
            }
            //caso tenha encontrado com base no termo, ele mostra encerrando a operação
            response.writeHead(200, {"Content-Type" : "application/json"})
            response.end(JSON.stringify(resultadoDaBusca))

        })
        
        
        
    }
    //INGREDIENTES
    else if(method === 'GET' && url.startsWith ('/ingredientes')){
       //localhost:333/ingredientes/pesquisa=cebola
        //trazer todas as receitas que possuem esse ingrediente
        const urlParam = new URLSearchParams(url.split("?")[1])
        const termo = urlParam.get('termo')
        fs.readFile("receitas.json", "utf8", (err, data) => {
            if (err) {
                response.writeHead(500, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Erro interno no servidor" }))
                return
            }
            const jsonData = JSON.parse(data)
            const ListarReceitasPorIngrediente = jsonData.filter((receita) => receita.ingredientes.includes(termo))

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

