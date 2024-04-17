import http from 'node:http';

const PORT = 3333;

const participants = [];
let lastParticipantId = 0; // Variável para rastrear o último ID usado

const server = http.createServer((request, response) => {
    const { url, method } = request;
    console.log('URL: ', url);

    if (url === "/participants" && method === "GET") {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(participants));
    } else if (url === "/participants/count" && method === "GET") {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify({ count: participants.length }));
    } else if (url === "/participants/count/over18" && method === "GET") {
        const over18 = participants.filter(participant => participant.age >= 18).length;
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify({ countOver18: over18 }));
    }else if (url === "/participants/city/most" && method === "GET") {
        const cityCount = participants.reduce((cityMap, participant) => {
            cityMap[participant.city] = (cityMap[participant.city] || 0) + 1;
            return cityMap;
        }, {});
    
        let mostCommonCity = null;
        let maxCount = 0;
    
        for (const city in cityCount) {
            if (cityCount[city] > maxCount) {
                mostCommonCity = city;
                maxCount = cityCount[city];
            }
        }
    
        if (mostCommonCity) {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ mostCommonCity: mostCommonCity }));
        } else {
            response.writeHead(404, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ message: "Não há participantes registrados" }));
        }
    }else if (url.startsWith("/participants/") && method === "PUT") {
        const participantsId = url.split('/')[2];
    
        let body = "";
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const updateParticipant = JSON.parse(body);
            const index = participants.findIndex(
                (participant) => participant.id === participantsId
            );
    
            if (index !== -1) {
                participants[index] = {...participants[index], ...updateParticipant};
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify(participants[index]));
            } else {
                response.writeHead(404, {"Content-Type": "application/json"});
                return response.end(JSON.stringify({message: "Participante não encontrado"}));
            }
        });
    }else if (url === "/participants" && method === "POST") {
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
    } else if (url.startsWith("/participants/") && method === "DELETE") {
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
