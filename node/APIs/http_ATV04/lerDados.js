import fs from 'node:fs'
import { type } from 'node:os'

const lerDados = (callback) => {
    fs.readFile('usuarios.json', 'utf8', (err, data) =>{
        if(err){
            callback(err)
        }
        try{
            const usuario = JSON.parse(data)
            callback(null, usuario)
        } catch(error) {
            callback(error)
        }
    })
}
export default lerDados