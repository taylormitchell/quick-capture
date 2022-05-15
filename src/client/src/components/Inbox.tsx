import Note from "../models/Note";
import Entry from "../components/Entry";
import Card from "../components/Card";
import * as actions from "../models/Note";
import React from "react";

type Props = {
  inboxNotes: Note[];
  applyToNote: (id: string, fn: (n: Note) => Note) => void;
};

const Inbox = (props: Props) => {
  const { inboxNotes } = props;

  const keep = (id: string) => props.applyToNote(id, actions.keep);
  const archive = (id: string) => props.applyToNote(id, actions.archive);
  // const skip = (id) => props.updateNote(currentNote.id, {...currentNote, dueDate: Date.now() + 5 * 60 * 1000});
  let quickActions = (id: string) => (
    <div className="quick-actions">
      <button onClick={() => keep(id)}>Keep</button>
      <button onClick={() => archive(id)}>Archive</button>
      {/* <button onClick={skip}>Skip</button> */}
    </div>
  )

  return (
    <div className="inbox column">
      {inboxNotes.length > 0 ? (
        <p>Remaining: {inboxNotes.length}</p>
      ): (<p>Done!</p>)}
      {props.inboxNotes
        .sort((a, b) => b.dueDate - a.dueDate)
        .map((n) => (
          <Card key={n.id} note={n} applyToNote={props.applyToNote} quickActions={quickActions(n.id)}/>
        ))}
    </div>
  );
};

export default Inbox;
