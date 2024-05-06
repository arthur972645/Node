import fs from 'node:fs'
import { request } from 'node:http'

const lerDadosFuncionarios = ( callback) => {
    fs.readFile("funcionarios.json","utf8",(err, data) => {
        if(err){
            callback(err)
        }
        try {
            const funcionario = JSON.parse(data)
            callback(null, funcionario)
        } catch (error){
            callback(error)
        }
    })
}
export default lerDadosFuncionarios
