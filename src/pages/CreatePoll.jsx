import PollForm from "../components/PollForm"
import "./CreatePoll.css"

function CreatePoll() {
  async function createPoll(data) {
    await fetch("/api/command", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ command:"createPoll", ...data })
    });
    alert("Enquete criada!")
  }

  return (
    <section className="PollsList">
      <h1 className="title">Criar enquete</h1>
      <div className="list">
        <PollForm
          initialOptions={[]}
          submitLabel="Criar Enquete"
          onSubmit={createPoll}
        />
      </div>
    </section>
  );
}

export default CreatePoll