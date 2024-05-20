import fs from 'node:fs'

const lerDadosPessoas = (callbak) => {
    fs.readFile('pessoas.json', 'utf8', (err, data)=>{
        if(err){
            callbak(err)
        }
        try{
            const pessoas = JSON.parse(data)
            callbak(null, pessoas)
        } catch(error){
            callbak(error)
        }
    })
}
export default lerDadosPessoas