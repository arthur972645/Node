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

//Modulo interno do Node.js sendo importado, esse modulo permite a criação de um servidor
import http from 'node:http'

//Definindo para a variavel PORT, qual sera a porta em que o servidor vai ser executado 
const PORT = 3333

//array que será usado para guardar os dados dos usuarios
const users = []

//criando um servidor atraves do metodo createServer, onde vai ter uma função que sempre será chamda quando for feito uma requisição ao servidor
//Essa função vai retornar o parametro request - reprenta a requisição http recebida
//Essa função vairetornar o parametro response - representear a resposta enviado de volta
const server = http.createServer((request, response) => {
    //to extraindo o metodo da solitação e o caminho da solicitação
    const {method, url} = request

    //estamos querendo listar todos os usuarios cadastrados, com isso fazemos um validação para saber se é isso mesmo. Essa validação é feita da seguinte forma, se a url = caminho  for igual /users e se o metodo ustilizado para puxar esses dados for o GET, significa que o usuario ta pedidno de volta todos os usuarios cadastrados
    //vai veririficar se ta puxando do users
    if(url === '/users' && method === "GET"){//Buscar todos os usuários
        //É dessa forma que vc retrona os dados pro usuarios 
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(users))
    }
    
   
    else if(false){//buscar um uniico usuasrio
     //Aqui vaos adicionar um novo usuario, para isso é feito uma validação para saber se vai ser adicionado no caminho /users e se o metodo utulizado para adcionar - é o POST, caso for, vai se feita a logica para adionar um novo usuario
     //vai verificar se ta adcionado no users
    }else if (url === '/users' && method === "POST"){ //cadastrando um usuario
        //vai servir para armazenar os dados que estão sendo enviado pro corpo da solicitação, ou seja, os usuarios
        let boby = ''
        //vai ser envaido dados, essa função vai ler os dados e converter do tipo shunk para sting e anexar no body
        request.on('data',(chunk) => {
            boby += chunk.toString()
        })
        //idica que que o body ja ta completo, ou seja, com todos os dados recebidos e podemos continuar a operação
        request.on('end',() => {
            //estamos convertendo os dadso recebidos do body para objeto js, ataves do JSON.parse()
            const novoUsuario = JSON.parse(boby)
            novoUsuario.id = '1'
            //adicoando o novoUsuario para o array users
            users.push(novoUsuario)

            //idicar que o recurso foi criado com sucesso e é um objeto JSON
            response.writeHead(201, {'Content-Type' : 'application/json'})
            //enviando a resposta a resposta de volta ao cliente, onde a gente converte o novo usuario que está como objeto Json e enviamos pro corpo da resposta
            response.end(JSON.stringify(novoUsuario))
        })
    } 
})

server.listen(PORT, () => {
    console.log(`Servidor on PORT: ${PORT}`)
})