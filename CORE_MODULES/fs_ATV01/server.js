import http from 'node:http'
import fs from 'node:fs'

const PORT = 4444
const listarUsuarios = []

const server = http.createServer((request, response) => {
    const {url, method} = request
    console.log('URL: ',url)

    if(url === "/usuarios" && method === "GET"){
        
    }


})
server.listen(PORT, () => {
    console.log(`Servidor on na PORT: ${PORT}`)
})