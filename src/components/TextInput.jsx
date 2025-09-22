import "./TextInput.css"


function TextInput({required, label, value, onChange}) {
  return (
    <div className='TextInput'>
        <label>
            {label}
        </label>
        <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        />
    </div>
  )
}

export default TextInput