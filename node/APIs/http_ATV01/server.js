/*METODOS: 
GET: Puxar algum dado
*/



//importando o modulo interno http do Node.js
import http from 'node:http';
//Definindo a porta que o servidor será executado
const PORT = 3333;
//Importante criar essa variavel vazia, pois é nela que vai ser armazenada os participantes
const participants = [];
//Variavel ára contar a quantidade de participantes, cada participante tera um id, que sempre que é adicionado um novo participante, é o id do anterior + 1
let lastParticipantId = 0;
//Criando um servidor pelo metodo HTPP, vai ter o parametro da request, que é um "pedido", e o paramentro response "que é a resposta para o pedido"
 const server = http.createServer((request, response) => {
    //extraindo a url e o metodo utilizado e igualando a requição(request)
    const { url, method } = request;
    console.log('URL: ', url);
 
    //BUSCAR TODOS OS PARTICIPANTES
    //Validação para saber se a url sendo utilizada é igual a /participants e se o metodo é GET, ou seja, puzar algo
    if (url === "/participants" && method === "GET") {
        // Define o cabeçalho da resposta para indicar que é JSON, codigo padrão
        response.setHeader('Content-Type', 'application/json');
        //Vamos supor que vc vai adicionar 3 participantes, esse's  participantes serão adicionado no array participants, e agora vc estão finalizando a operação(.end) e mostrando esse array(participants) em formato JSON
        response.end(JSON.stringify(participants));
    } 
    //BUSCAR O NUMERO TOTAL DE PARTICIPANTES
    //vai ser verificado se a url onde sera feita a requisição vai ser a /participants/count e se o pedido(request) foi GET
    else if (url === "/participants/count" && method === "GET") {
        //codigo padrao que defina o caveçalhoda da resposta como json, e o codigo 200 para indicar que a solicitação de um dado da api foi bem sucedida
        response.writeHead(200, {"Content-Type": "application/json"});
        //finaliza a operação e devolve o numero de participantes, que é um array, então da pra gente contar os elementos do array pelo .lengeth
        response.end(JSON.stringify({ count: participants.length }));
    } 
    //BUSCAR A QUANTIDADE DE PARTICIPANTES MAIORES DE 18 ANOS
    //Verificar se a a requisição é pelo metodo GET e se ta sendo feita na url  /participants/count/over18
    else if (url === "/participants/count/over18" && method === "GET") {
        //Como participants é um array, nos podemos usar metodos de array, como o metodo filtrtar, que vai busrcar apenas os participantes maiores de 18 anos e como isso vai retornar um array, a gente usa o .length para na variavel ser guardado apenas a quantidade de maiores de 18
        const over18 = participants.filter(participant => participant.age >= 18);
        //codigo padrao que defina o caveçalhoda da resposta como json, e o codigo 200 para indicar que a solicitação de um dado da api foi bem sucedida
        response.writeHead(200, {"Content-Type": "application/json"});
        //finalizar a operação, e mostrar para o cliente a todos os usuarios maiores de 18 anos
        response.end(JSON.stringify({ countOver18: over18 }));
    }
    //BUSCAR A CIDADE COM MAIS PESSOAS
    else if (url === "/participants/city/most" && method === "GET") {
        //vamos analizar o metodo reduce, que vai armazenar os a quantidade de dados referentes a unico valor
        //o cityMap é o contador, ou seja é nela que vai ta a quantidade referente a um unico valor
        const cityCount = participants.reduce((cityMap, participant) => {
            //vai pegar o seu array e vai ir na parte das cidades e vai verificar se essa cidade ja apareceu antes ou se chegou agora, e vai atribuir a essa cidade 1 ponto
            cityMap[participant.city] = (cityMap[participant.city] || 0) + 1;
            return cityMap;
        }, {});
    
        let mostCommonCity = null;
        let maxCount = 0;
        //vai enconrtar a cidade mais comum, se a contagem da cidade atual for maior que a maxCount, ele atualiza o valor da maxCout e da cidade 
        for (const city in cityCount) {
            if (cityCount[city] > maxCount) {
                mostCommonCity = city;
                maxCount = cityCount[city];
                console.log(mostCommonCity)
                console.log(maxCount)
            }
        }
        //vai mostar a cidade que apareceu mais  
        if (mostCommonCity) {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ mostCommonCity: mostCommonCity }));
        } else {
            response.writeHead(404, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ message: "Não há participantes registrados" }));
        }
    }
    //ATUALIZAR USUARIO +
    else if (url.startsWith("/participants/") && method === "PUT") {
        //pega a url, e o metodo como escrito abaixo permite colocar depois do "/" o id, e consequentemente as informações desse participante
        const participantsId = url.split('/')[2];
        //uma sting vazia onde vai ser colocado o dado atualizado
        let body = "";
        request.on('data', (chunk) => {
            body += chunk;
        });
        //quando o dado atualizado é recebido ele é analizado em formato JSON
        request.on('end', () => {
            const updateParticipant = JSON.parse(body);
            //vai atribuir ao index qual é o id desse participante atualizado, por isso que fica o mesmo
            const index = participants.findIndex(
                (participant) => participant.id === participantsId
            );
            //se o id for encontrado quer dizer que ele exite, então os dados são ataulizaddos
            if (index !== -1) {
                participants[index] = {...participants[index], ...updateParticipant};
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(participants[index]));
            } else {
                response.writeHead(404, {"Content-Type": "application/json"});
                return response.end(JSON.stringify({message: "Participante não encontrado"}));
            }
        });
    }
    //ADICIONAR NOVO PARTICIPANTE
    else if (url === "/participants" && method === "POST") {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const newParticipant = JSON.parse(body);

            if (newParticipant.password !== newParticipant.confirmPassword) {
                response.writeHead(400, {"Content-Type": "application/json"});
                return response.end(JSON.stringify({ message: "As senhas fornecidas não correspondem à primeira senha digitada" }));
            }
            if (newParticipant.age < 16) {
                response.writeHead(403, {"Content-Type": "application/json"});
                return response.end(JSON.stringify({ message: "Apenas usuários maiores que 15 anos" }));
            }
            
            const id = ++lastParticipantId; // Incrementa o último ID usado
            newParticipant.id = id.toString(); // Atribui o ID ao novo participante
            participants.push(newParticipant);
            
            response.writeHead(201, {"Content-Type": "application/json"});
            response.end(JSON.stringify(newParticipant));
        });
    } 
    //DELETAR PARTICIPANTE
    else if (url.startsWith("/participants/") && method === "DELETE") {
        const participantsId = url.split('/')[2];
        const index = participants.findIndex(
            (participant) => participant.id === participantsId
        );

        if (index !== -1) {
            participants.splice(index, 1);
            response.writeHead(204);
            return response.end();
        } else {
            response.writeHead(404, {"Content-Type": "application/json"});
            return response.end(JSON.stringify({message: "Participante não encontrado"}));
        }
    } else {
        response.writeHead(404, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({codigo: 404, message: "Página não encontrada"}));
    }
});

server.listen(PORT, () => {
    console.log('Servidor está on ' + PORT);
});
