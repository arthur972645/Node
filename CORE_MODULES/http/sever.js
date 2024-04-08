//Modulo interno do do node.js que permite  criação de uma servidor
const http = require('node:http')
//A prota de entrada do servidor
const PORT = 3333

//Vai ser criado um servidor pelo metodo createServer
//Quando uam requisição é feita ao servidor, ele ativa o request( a requisição HTPP recebida)
//Apos ele atividar o request ele ativa o response, que é o que a gente vai usar para enviar uma resposta ao cliente
const server = http.createServer((request, response)=>{
    //Dependendo da requisição feita vai enviar para uma determinada pagina
    if(request.url === '/'){
        //ocodigo 200 pra se for ok
       response.writeHead(200, {'Content-Type': 'text/plan'})
       response.end('Página Inicial')
    }else if(request.url === '/sobre'){
       response.writeHead(200, {'content-Type': 'text/plan'})
       //Termina a resposta enviando os dados fornecidos de volta ao cliente e encerrando a conexão.
       response.end('Página Sobre')
    }else{
        // codigo  404 para erro
       response.writeHead(404, {'Content-Type': 'text/plan'})
       response.end('Página não encontrada')
    }
   })
   
   server.listen(PORT, () =>{
       console.log('Servidor on PORT'+PORT)
   })