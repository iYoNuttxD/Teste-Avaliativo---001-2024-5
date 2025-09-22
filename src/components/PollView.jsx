import "./PollView.css"

function PollView({ title, start, end }) {
  function statusReport(start, end) {
    const today = new Date()
    const dStart = new Date(start.replace(' ', 'T'))
    const dEnd   = new Date(end.replace(' ', 'T'))

    if (today < dStart) {
      return "Ainda não começou"
    } else if (today >= dStart && today <= dEnd) {
      return "Em andamento"
    } else {
      return "Encerrada"
    }
  }

  const formattedStart = new Date(start.replace(" ", "T")).toLocaleString("pt-BR")
  const formattedEnd = new Date(end.replace(" ", "T")).toLocaleString("pt-BR")

  return (
    <div className="PollView">
      <h2>{title}</h2>
      <div className="meta">
        <span>Início: {formattedStart}</span>
        <span>Fim: {formattedEnd}</span>
      </div>
      <span className="status">
        Status: {statusReport(start, end)}
      </span>
    </div>
  )
}

export default PollView
