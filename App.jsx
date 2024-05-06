import Input from './Input'
import React from 'react'
const App = () => {

    const [nome, setNome] = React.useState("")

    return(
        <>
            <Input
                label="Nome"
                id="nome"
                value={nome}
                setValue={setNome}
            />
        <p>{nome}</p>        
        </>
      
    
    )
}
export default App