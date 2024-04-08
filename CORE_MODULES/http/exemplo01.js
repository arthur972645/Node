const http = require ('node:http');
const PORT = 3333 || 4444

const server = http.createServer((request, response)=>{
    response.writeHead(200, {'Content-Type' : 'test/plan'})
    response.write('hey, brothers.')
    response.end()
})


server.listen(PORT,()=>{
    console.log(`servidor on PORT ${PORT}`)
})
