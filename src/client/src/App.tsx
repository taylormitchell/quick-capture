import { useState } from "react";
import "./App.css";
import { Note, create as createNote } from "./models/Note";
import All from "./components/All";
import Inbox from "./components/Inbox";
import Entry from "./components/Entry";
import { useSyncingState } from "./syncHook";

const backend: "local" | "server" = process.env.REACT_APP_BACKEND === "server" ? "server" : "local";

function App() {
  const initialNotes = backend === "server" ? [] : require("./assets/demo-notes.json");
  const [notes, setNotes, notesConnected] = useSyncingState<Note[]>(initialNotes, "notes");
  const [noteForm, setNoteForm] = useState<{text: string} & Partial<Note>>({text: ""});

  const updateNote = (id: string, fn: (n: Note) => Note) => {
    setNotes((notes) => {
      return notes.map((n) => (n.id === id ? fn(n) : n));
    });
  };

  const addNote = (note: Partial<Note>) => {
    setNotes((notes) => [...notes, createNote(note)]);
  };

  const updateNoteForm = (values: Partial<Note>) => {
    setNoteForm((noteForm) => {
      return { ...noteForm, ...values };
    });
  };
  const submitNoteForm = () => {
    addNote(noteForm);
    setNoteForm({text: ""});
  };

  type View = "all" | "inbox" | "entry";
  const [view, setView] = useState<View>("all");

  // Set inbox notes
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const inboxNotes = notes.filter((n) => n.dueDate <= tomorrow && n.state === "Active");

  const [entryOpen, setEntryOpen] = useState(false);
  if (!notesConnected) {
    return <div>Can't connect to server, no app for you :(</div>;
  }
  return (
    <div className="App">
      <main>
        {view === "all" && <All notes={notes} updateNote={updateNote} />}
        {view === "inbox" && <Inbox inboxNotes={inboxNotes} updateNote={updateNote} />}
        {entryOpen ? (
          <Entry
            noteForm={noteForm}
            updateNoteForm={updateNoteForm}
            submitNoteForm={submitNoteForm}
            closeEntry={() => setEntryOpen(false)}
          />
        ) : (
          <div id="create-button" onClick={() => setEntryOpen(true)}>
            +
          </div>
        )}
      </main>
      {!entryOpen && (
      <nav>
        <button className={view === "all" ? "selected" : ""} onClick={() => setView("all")}>
          All
        </button>
        <button className={view === "inbox" ? "selected" : ""} onClick={() => setView("inbox")}>
          Inbox
        </button>
      </nav>
      )}
    </div>
  );
}

export default App;
