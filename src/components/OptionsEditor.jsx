import TextInput from "./TextInput";
import "./OptionsEditor.css";

function OptionsEditor({ options, onChange, onAdd, onRemove }) {
  const canRemove = typeof onRemove === "function";

  return (
    <div className="OptionsEditor">
      {options.map((opt, i) => (
        <div key={i} className="OptionsEditor-item">
          <TextInput
            required
            label={`Opção ${i + 1}`}
            value={opt}
            onChange={(val) => onChange(i, val)}
          />
          {canRemove && (
            <button type="button" className="btn btn-remove" onClick={() => onRemove(i)}>
              Remover opção
            </button>
          )}
        </div>
      ))}

      <button type="button" className="btn btn-add" onClick={onAdd}>
        Adicionar opção
      </button>
    </div>
  );
}

export default OptionsEditor;
