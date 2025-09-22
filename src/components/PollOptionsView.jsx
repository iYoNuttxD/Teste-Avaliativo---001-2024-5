import "./PollOptionsView.css"

function PollOptionsView({ pollId, id, text, votes, status, onVote }) {
  const disabled = status === "Ainda não começou" || status === "Encerrada"

  return (
    <div className="PollOptionsView">
      <button disabled={disabled} onClick={() => onVote(pollId, id)}>
        {text}
      </button>
      <span>{votes} votos</span>
    </div>
  )
}

export default PollOptionsView
