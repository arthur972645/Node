

const Input = ({label, id, setValue, ...props}) => {
    return(
        <>
            <label htmlFor={id}>{label}</label>
            <input 
            name={id} 
            id={id}
            onChange={({target}) => setValue(target.value)}
            //forma que vai permitir vc usuar o "value", "id" e etc dentre de uma tag, sem precisar esscrever essas tegs
            {...props} 
            />
        </>
    )
}

export default Input