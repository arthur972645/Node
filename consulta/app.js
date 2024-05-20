//Trabalhando com imagens
//caminho de onde a imagem está na aplicação - PATH
//1º - Colocar a imagem em uma pasta na raiz projeto - Não paga
//2º - Contra serviços (API's) para adicionar imagem - Custo Alto

import { createServer } from "node:http";
import { writeFile, readFile, rename } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import formidable, { errors as formidableErrors } from "formidable";
import { v4 as uuidv4 } from "uuid";

import lerDadosUsuarios from "./lerUsuarios.js";

const PORT = 1010;

//import e export
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer(async (request, response) => {
  const { method, url } = request;
  if (method === "GET" && url === "/usuarios") {
    lerDadosUsuarios((err, usuarios) => {
      if (err) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Não possível ler o arquivo" }));
        return;
      }
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(usuarios));
    });
  } else if (method === "POST" && url === "/usuarios") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      const novoUsuario = JSON.parse(body);
      //Validações do dados vindo do body
      lerDadosUsuarios((err, usuarios) => {
        if (err) {
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({ message: "Não possível ler o arquivo" })
          );
          return;
        }

        novoUsuario.id = uuidv4();

        const verificaSeEmailExiste = usuarios.find(
          (usuario) => usuario.email === novoUsuario.email
        );

        if (verificaSeEmailExiste) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ message: "Email já está em uso" }));
          return;
        }

        usuarios.push(novoUsuario);

        writeFile("usuarios.json", JSON.stringify(usuarios, null, 2), (err) => {
          if (err) {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ message: "Não cadastrar os dados no arquivo" })
            );
            return;
          }
          response.writeHead(201, { "Content-Type": "application/json" });
          response.end(JSON.stringify(novoUsuario));
        });
      });
    });
  } else if (method === "POST" && url === "/perfil") {
    const form = formidable({});
    let fields;
    let files;
    try {
      [fields, files] = await form.parse(request);
    } catch (err) {
      // example to check for a very specific error
      if (err.code === formidableErrors.maxFieldsExceeded) {
      }
      console.error(err);
      response.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      response.end(String(err));
      return;
    }

    const { id, nome, bio } = fields;
    const imagemDePerfil = files.imagemDePerfil;
    //NORMALIZE O CAMINHO DA IMAGEM

    if (!nome || !bio || !imagemDePerfil) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          error:
            "Todos os campos são obrigatórios: nome, bio, Imagem do Perfil",
        })
      );
      return;
    }

    lerDadosUsuarios((err, usuarios) => {
      if (err) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Erro ao ler o Arquivo" }));
        return;
      }

      const indexUsuario = usuarios.findIndex(
        (usuario) => usuario.id === id[0]
      );

      if (indexUsuario === -1) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            message: "Faça o cadastro antes de criar um perfil",
          })
        );
        return;
      }

      //caminho/imagens/id.png
      const caminhoImagem = path.join(__dirname, "imagens", id + ".png");

      const perfil = {
        nome: nome[0],
        bio: bio[0],
        caminhoImagem,
      };

      usuarios[indexUsuario] = { ...usuarios[indexUsuario], perfil };

      writeFile("usuarios.json", JSON.stringify(usuarios, null, 2), (err) => {
        if (err) {
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({message: "Não é possível escrever no arquivo JSON"})
          );
          return;
        }

        rename(files.imagemDePerfil[0].filepath, caminhoImagem, (err) => {
          if (err) {
            console.log("err: ", err)
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(JSON.stringify({message: "Não é salvar a imagem" }));
            return;
          }
        });

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Perfil Criado" }));

      });
    });
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Página não encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor on PORT: ${PORT}`);
});
rr) {
            console.log("err: ", err)
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(JSON.stringify({message: "Não é salvar a imagem" }));
            return;
          }
        });

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Perfil Criado" }));

      });
    });
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Página não encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor on PORT: ${PORT}`);
});



--------------------------------------------------------------------------------------


import http from "http";
import { parse } from 'url';
import fs from "fs";
const model = {
  "nome": "Carlos Wilton",
  "cargo": "Instrutor",
  "cpf": "123.456.789-00",
  "email": "carlos@example.com",
  "telefone": "(11) 98765-4321",
  "data_contratacao": "2022-01-10",
  "salario": 4500,
  "habilidades": ["Front-End", "Back-End", "Docker", "SQL"],
  "idade": 18,
  "senha": "123",
  "confirmaSenha": "123"
}

const PORT = 8080;

const server = http.createServer((req, res) => {
  const { url, method } = req;
  const queryData = parse(req.url, true).query;

  fs.readFile("funcionarios.json", "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Erro interno do servidor" }));
      return;
    }

    let jsonData = [];
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
    }

    if (url === "/empregados" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(jsonData));
    } else if (url === "/empregados" && method === "POST") {

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const newItem = JSON.parse(body);
        if (!newItem.hasOwnProperty('idade') || !newItem.hasOwnProperty('nome') || !newItem.hasOwnProperty('cargo') || !newItem.hasOwnProperty('cpf') || !newItem.hasOwnProperty('senha') || !newItem.hasOwnProperty('confirmaSenha') || !newItem.hasOwnProperty('email') || !newItem.hasOwnProperty('telefone') || !newItem.hasOwnProperty('data_contratacao') || !newItem.hasOwnProperty('salario') || !newItem.hasOwnProperty('habilidades')) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: `Não foi autorizado a criação do empregado, está faltando informações, siga o modelo: ${model}` })
          );
        } else {
          if (newItem.idade < 18) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Não foi autorizado! Precisa ser maior de 18 anos!" })
            );
          } else if (newItem.senha !== newItem.confirmaSenha) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Não foi autorizado! As senhas não condizem" })
            );
          } else {
            newItem.id = jsonData.length + 1; // Gerar um novo ID
            jsonData.push(newItem);
            fs.writeFile(
              "funcionarios.json",
              JSON.stringify(jsonData, null, 2),
              (err) => {
                if (err) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Erro interno do servidor" })
                  );
                  return;
                }
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(newItem));
              }
            );
          }
        }
      });
    } else if (url.startsWith("/empregados/") && method === "PUT") {

      const id = parseInt(url.split("/")[2]);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const updatedItem = JSON.parse(body);
        // Procurar o empregado pelo ID e atualizar seus dados
        const index = jsonData.findIndex((item) => item.id === id);
        if (index !== -1) {
          if (!updatedItem.hasOwnProperty('idade') || !updatedItem.hasOwnProperty('nome') || !updatedItem.hasOwnProperty('cargo') || !updatedItem.hasOwnProperty('cpf') || !updatedItem.hasOwnProperty('senha') || !updatedItem.hasOwnProperty('confirmaSenha') || !updatedItem.hasOwnProperty('email') || !updatedItem.hasOwnProperty('telefone') || !updatedItem.hasOwnProperty('data_contratacao') || !updatedItem.hasOwnProperty('salario') || !updatedItem.hasOwnProperty('habilidades')) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: `Não foi autorizado a atualização do empregado, está faltando informações, siga o modelo: ${model}` })
            );
          } if (updatedItem.idade < 18) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Não foi autorizado! Precisa ser maior de 18 anos!" })
            );
          } else if (updatedItem.senha !== updatedItem.confirmaSenha) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Não foi autorizado! As senhas não condizem" })
            );
          }
          jsonData[index] = { ...jsonData[index], ...updatedItem };
          fs.writeFile(
            "funcionarios.json",
            JSON.stringify(jsonData, null, 2),
            (err) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "Erro interno do servidor" })
                );
                return;
              }
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(jsonData[index]));
            }
          );
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Empregado não encontrado" }));
        }
      });
    } else if (url.startsWith("/empregados/") && method === "DELETE") {

      const id = parseInt(url.split("/")[2]);
      const index = jsonData.findIndex((item) => item.id === id);
      if (index !== -1) {
        jsonData.splice(index, 1);
        fs.writeFile(
          "funcionarios.json",
          JSON.stringify(jsonData, null, 2),
          (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ message: "Erro interno do servidor" })
              );
              return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Empregado removido com sucesso" })
            );
          }
        );
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Livro não encontrado" }));
      }
    } else if (method === 'GET' && url === ('/empregados/count')) {
      const lengthPart = jsonData.length
      if (lengthPart === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: "Não foi encontrado participantes registrados" }))
      } else {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: `Existem ${lengthPart} participantes cadastrados!`, value: `${lengthPart}` }))
      }

    } else if (method === 'GET' && url.startsWith('/empregados/porCargo')) {
      const empregadoCargo = url.split('/')[3]
      const findEmploy = jsonData.filter(dado => dado.cargo == empregadoCargo)

      if (!findEmploy) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: "Empregado não encontrado, espero ter ajudado" }))
      } else {
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(findEmploy))
      }
    } else if (method === 'GET' && url.startsWith('/empregados/porHabilidade')) {
      const empregadoHabi = url.split('/')[3]
      const findEmploy = jsonData.filter(dado => dado.habilidades.find(habilidades => habilidades == empregadoHabi))

      if (!findEmploy) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: "Empregado não encontrado, espero ter ajudado" }))
      } else {
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(findEmploy))
      }
    } else if (method === 'GET' && url.startsWith('/empregados/porFaixaSalarial')) {
      const minSalary = parseFloat(queryData.min);
      const maxSalary = parseFloat(queryData.max);
      const funcionariosNaFaixa = jsonData.filter(funcionario => funcionario.salario >= minSalary && funcionario.salario <= maxSalary)
      if (!funcionariosNaFaixa) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: "Não foram encontrados funcionarios com essa Faixa salarial!" }))
      } else {
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(funcionariosNaFaixa))
      }
    } else if (method === 'GET' && url.startsWith('/empregados/')) {
      const empregadoId = url.split('/')[2]
      const findEmploy = jsonData.find(dado => dado.id == empregadoId)

      if (!findEmploy) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: "Empregado não encontrado, espero ter ajudado" }))
      } else {
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(findEmploy))
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Rota não encontrada" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor on PORT:${PORT}🚀`);
});