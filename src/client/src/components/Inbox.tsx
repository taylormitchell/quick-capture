import Note from "../models/Note";
import Entry from "../components/Entry";
import Card from "../components/Card";
import * as model from "../models/Note";
import React from "react";

type Props = {
  inboxNotes: Note[];
  updateNote: (id: string, values: Partial<Note>) => void;
  addNote: (text: string) => void;
};

const Inbox = (props: Props) => {
  const { inboxNotes } = props;
  const currentNote = inboxNotes.slice(-1)[0];

  const keep = () => props.updateNote(currentNote.id, model.keep(currentNote));
  const archive = () => props.updateNote(currentNote.id, model.archive(currentNote));

  return (
    <div className="inbox column">
      {currentNote ? (
        <React.Fragment>
          <header>
            <p>Remaining: {inboxNotes.length}</p>
          </header>
          <main>
            <Card key={currentNote.id} note={currentNote} updateNote={props.updateNote} />
          </main>
          <footer style={{ display: "flex", justifyContent: "center", paddingBottom: 20 }}>
            <button style={{ fontSize: "2em" }} onClick={keep}>
              Later
            </button>
            <button style={{ fontSize: "2em" }} onClick={archive}>
              Archive
            </button>
          </footer>
        </React.Fragment>
      ) : (
        <main>
          <p>Done!</p>
        </main>
      )}
    </div>
  );
};

export default Inbox;
