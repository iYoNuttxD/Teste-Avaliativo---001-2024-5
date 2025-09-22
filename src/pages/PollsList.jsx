import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PollView from "../components/PollView"
import "./PollsList.css"

function PollsList() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: "loadPolls" })
        })
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setPolls(data)
      } catch (e) {
        console.error(e)
        setError("Falha ao carregar enquetes.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) { return <div className="PollsList">Carregando…</div> }

  if (error) { return <div className="PollsList">{error}</div> }

  return (
    <section className="PollsList">
      <h1 className="title">Enquetes</h1>
      <div className="list">
        {polls.map(p => (
          <Link key={p.id} to={`/polls/${p.id}`} style={{ textDecoration: "none" }}>
            <PollView id={p.id} title={p.title} start={p.start} end={p.end} />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PollsList
