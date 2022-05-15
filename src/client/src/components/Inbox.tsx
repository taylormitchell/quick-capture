import Note from "../models/Note";
import Entry from "../components/Entry";
import Card from "../components/Card";
import * as model from "../models/Note";
import React from "react";

type Props = {
  inboxNotes: Note[];
  updateNote: (id: string, values: Partial<Note>) => void;
};

const Inbox = (props: Props) => {
  const { inboxNotes } = props;
  const currentNote = inboxNotes.slice(-1)[0];

  const keep = (id: string) => props.updateNote(id, model.keep(currentNote));
  const archive = (id: string) => props.updateNote(id, model.archive(currentNote));
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
        .sort((a, b) => a.dueDate - b.dueDate)
        .map((n) => (
          <Card key={n.id} note={n} updateNote={props.updateNote} quickActions={quickActions(n.id)}/>
        ))}
    </div>
  );
};

export default Inbox;
