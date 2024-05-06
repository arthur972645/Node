import React from "react"
const Select = () => {

    const [select, setSelect] = React.useState('')

    return(
        <form>
            <select value={select} onChange={({target}) => setSelect(target.value)}>
                <option disabled>Selecionar</option>
                <option value='sesi'>Sesi</option>
                <option value='senai'>Senai</option>
                <option value='iel'>IEL</option>
            </select>
            <h1>{select}</h1>
        </form>
    )
}
export default Select