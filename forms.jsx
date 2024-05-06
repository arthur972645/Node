import React from "react"
const Forms = () => {

    const[nome, setNome] = React.useState()
    const[email, setEmail] = React.useState()

    function clickSubmit(event){
        event.preventDefalute()
    }

    return(
        <form>
            <label onSubmit={clickSubmit}>Nome </label>
            <input 
                type="text"
                id="nome"
                value={nome}
                onChange= {({targen}) => setNome(targen.value)}
                
            />
            <p>{nome}</p>
            <label htmlFor="email">Email</label>
            <input 
                type="text"
                id="nome"
                value={email}
                onChange= {({targen}) => setEmail(targen.value)}
                
            />
            <p>{nome}</p>
        </form>
    )
}
export default Forms
