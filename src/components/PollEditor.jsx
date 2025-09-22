import { useNavigate } from "react-router-dom"
import "./PollEditor.css"

function PollEditor({ pollId }) {
  const navigate = useNavigate()

  async function handleDelete(pollId) {
    try {
      await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: "deletePoll",
          pollId,
        }),
      })
      alert("Enquete deletada com sucesso!")
      navigate("/polls")
    } catch (err) {
      console.error("Erro ao deletar enquete:", err)
    }
  }

  function handleEdit(pollId) {
    navigate(`/polls/${pollId}/edit`)
  }

  return (
    <div className="PollEditor">
      <button onClick={() => handleDelete(pollId)}>
        Deletar Enquete
      </button>
      <button onClick={() => handleEdit(pollId)}>
        Editar Enquete
      </button>
    </div>
  )
}

export default PollEditor
