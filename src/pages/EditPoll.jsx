import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import PollForm from "../components/PollForm";

function EditPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "loadPoll", id })
      });
      const p = await res.json();
      const toInput = s => (s || "").slice(0, 16);
      setIds((p.options || []).map(o => o.id));               
      setInitial({
        initialTitle: p.title,
        initialStart: toInput(p.start),
        initialEnd: toInput(p.end),
        initialOptions: (p.options || []).map(o => o.text),
      });
    })()
  }, [id]);

  async function updatePoll({ title, start, end, options }) {
    const payloadOptions = options.map((text, i) => {
      const optId = ids[i];
      return optId ? { id: optId, text } : { text };
    });

    await fetch("/api/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "editPoll", id, title, start, end, options: payloadOptions })
    });
    alert("Enquete atualizada!");
    navigate(`/polls/${id}`);
  }

  function handleRemoveOption(index) {
    setIds((prev) => prev.filter((_, i) => i !== index));
  }

  if (!initial) return <div className="PollsList">Carregando…</div>;

  return (
    <section className="PollsList">
      <h1 className="title">Editar enquete</h1>
      <div className="list">
        <PollForm
          {...initial}
          submitLabel="Salvar alterações"
          onSubmit={updatePoll}
          onRemoveOption={handleRemoveOption}
        />
      </div>
    </section>
  );
}

export default EditPoll