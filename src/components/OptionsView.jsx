import PollOptionsView from "./PollOptionsView"
import "./OptionsView.css"

function OptionsView({pollId, options, status, onVote}) {
  return (
      <div className='OptionsView'>
        {options.map((opt) => (
          <PollOptionsView
            key={opt.id}
            pollId={pollId}
            id={opt.id}
            text={opt.text}
            votes={opt.votes}
            status={status}
            onVote={onVote}
          />
        ))}
      </div>
  )
}

export default OptionsView
