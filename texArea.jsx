
import React from "react"

const TextArea = () => {

    const [menssagem, setMenssagem] = React.useState('')
    return(
        <form>
            <textarea id="menssagem"  rows="5" value={menssagem} onChange={({target}) => setMenssagem(target.value)}/>
    =
        <p>{menssagem}</p>
        </form>
    )
}

export default TextArea

