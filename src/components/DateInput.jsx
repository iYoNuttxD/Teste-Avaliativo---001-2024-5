import "./DateInput.css"

function DateInput({start, end, onChange}) {

  return (
    <div className='DateInput'>
      <label>
        Data para Início
      </label>
      <input 
        type="datetime-local" 
        value={start}
        onChange={(e) => onChange("start", e.target.value)}
      />
      <label>
        Data para Término
      </label>
      <input
        type="datetime-local" 
        value={end}
        onChange={(e) => onChange("end", e.target.value)}
      />
    </div>
  )
}

export default DateInput