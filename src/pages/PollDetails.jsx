import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PollView from "../components/PollView"
import OptionsView from "../components/OptionsView"
import PollEditor from "../components/PollEditor"
import "./PollDetails.css"

function PollDetails() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function handleVote(pollId, optionId) {
    try {
      await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          command: "voteOption", 
          pollId, 
          optionId 
        })
      })
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "loadPoll", id: pollId })
      })
      const updated = await res.json()
      setPoll(updated)
    } catch (e) {
      console.error("Erro ao votar:", e)
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: "loadPoll", id })
        })
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setPoll(data)
      } catch (e) {
        console.error(e)
        setError("Falha ao carregar enquete.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) { return <div className="PollsList">Carregando…</div> }
  if (error) { return <div className="PollsList">{error}</div> }
  if (!poll) { return <div className="PollsList">Enquete não encontrada.</div> }

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

  return (
    <section className="PollsList">
      <h1 className="title">Detalhe da Enquete</h1>
      <div className="list">
        <PollView 
          title={poll.title} 
          start={poll.start} 
          end={poll.end} 
        />
        <OptionsView 
          pollId={poll.id}
          options={poll.options || []} 
          status={statusReport(poll.start, poll.end)}
          onVote={handleVote}
        />
      </div>
      <div className="danger">
        <PollEditor 
          pollId={poll.id}
        />
      </div>
    </section>
  )
}

export default PollDetails
