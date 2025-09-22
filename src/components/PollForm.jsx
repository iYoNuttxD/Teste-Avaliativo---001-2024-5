import { useState } from "react";
import DateInput from "./DateInput";
import TextInput from "./TextInput";
import OptionsEditor from "./OptionsEditor";
import "./PollForm.css";

function PollForm({
  initialTitle = "",
  initialStart = "",
  initialEnd = "",
  initialOptions = [],
  submitLabel = "Salvar",
  onSubmit,
  onRemoveOption = () => {},
}) {
  const [title, setTitle] = useState(initialTitle);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [options, setOptions] = useState(initialOptions);

  async function handleSubmit(e) {
    e.preventDefault();
    if (options.length < 3) {
      alert("Mínimo 3 opções.");
      return;
    }
    await onSubmit({ title, start, end, options });
  }

  function handleDateChange(type, value) {
    if (type === "start") setStart(value)
    if (type === "end") setEnd(value)
  }

  function handleRemoveOption(index) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    onRemoveOption(index);
  }

  return (
    <form className="PollForm" onSubmit={handleSubmit}>
      <TextInput required label="Título" value={title} onChange={setTitle} />

      <DateInput
        start={start}
        end={end}
        onChange={handleDateChange}
      />

      <OptionsEditor
        options={options}
        onChange={(index, val) => {
          const next = [...options];
          next[index] = val;
          setOptions(next);
        }}
        onRemove={handleRemoveOption}
        onAdd={() => setOptions([...options, ""])}
      />
      <button type="submit" className="btn">{submitLabel}</button>
    </form>
  );
}

export default PollForm;
