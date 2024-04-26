// ordem de preferencia de metodos
// primeiro sempre
// GET e url === 
// GET e url.startsWith

// POST e url === 
// POST e url.startsWith

// PUT e url === 
// PUT e url.startsWith


import http from "http";
const PORT = 4444;

const funcionarios = [];

let contaFuncionarios = 0;

const server = http.createServer((request, response) => {
  const { url, method } = request;
  console.log("URl ", url);

   //BUSCAR TODOS OS FUNCIONARIOS:
  if(url === "/funcionarios"  && method === "GET") {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(funcionarios));
  } 
    //BUSCAR USUARIO PELO ID:
  else if (url.startsWith("/funcionarios") && method === "GET") {
    const funcionarioId = url.split('/')[2]
    const funcionario = funcionarios.find((funcionario) => funcionario.id == funcionarioId)
    
    if(funcionario){
        response.setHeader("Content-Type","application/json")
        response.end(JSON.stringify(funcionario))
    }else{
        response.writeHead(404, {"Content-Type":"application/json"})
        response.end(JSON.stringify({message: "Usuario não encontrado"}))
    }

} 
    //CADASTRAR FUNCIONARIOS:
  else if (url === "/funcionarios" && method === "POST") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const newFuncionarios = JSON.parse(body);

      if (newFuncionarios.age < 18) {
        response.writeHead(403, { "Content-Type": "application/json" });
        return response.end(
          JSON.stringify({ message: "Apenas usuarios com 18 ou mais" })
        );
      }

      const id = ++contaFuncionarios;
      newFuncionarios.id = id.toString();
      funcionarios.push(newFuncionarios);
      console.log(newFuncionarios);

      response.writeHead(201, {"Content-Type": "application/json"});
      response.end(JSON.stringify(newFuncionarios));
    });
  } 
  
  else{
        response.writeHead(404, {"Content-Type":"application/json"})
        response.end(JSON.stringify({message: "Usuario não encontrado"}))
    }

})
server.listen(PORT, () => {
  console.log("Servidor está on " + PORT);
});
