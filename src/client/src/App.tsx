import { useEffect, useState } from "react";
import "./App.css";
import { Note, create as createNote } from "./models/Note";
import Stream from "./components/Stream";
import Inbox from "./components/Inbox";
import Entry from "./components/Entry";
import { useSyncingState } from "./syncHook";

function App() {
  const [notes, setNotes, notesConnected] = useSyncingState<Note[]>([], "notes");
  // const [noteInput, setNoteInput] = useState<Partial<Note>>({});
  const [noteForm, setNoteForm] = useState<Partial<Note>>({});

  const updateNote = (id: string, values: Partial<Note>) => {
    setNotes((notes) => {
      return notes.map((n) => (n.id === id ? { ...n, ...values } : n));
    });
  };

  const applyToNote = (id: string, fn: (n: Note) => Note) => {
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
    setNoteForm({});
  };

  type View = "list" | "inbox" | "entry";
  const [view, setView] = useState<View>("list");

  // Set inbox notes
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const cutoff = today; // Date.now() + 0*24*60*60*1000
  const inboxNotes = notes.filter((n) => n.dueDate <= cutoff && n.state === "Active");

  const [entryOpen, setEntryOpen] = useState(false);
  if (!notesConnected) {
    return <div>Can't connect to server, no app for you :(</div>;
  }
  return (
    <div className="App">
      <main>
        {view === "list" && <Stream notes={notes} applyToNote={applyToNote} />}
        {view === "inbox" && <Inbox inboxNotes={inboxNotes} applyToNote={applyToNote} />}
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
      <nav>
        <button className={view === "list" ? "selected" : ""} onClick={() => setView("list")}>
          List
        </button>
        <button className={view === "inbox" ? "selected" : ""} onClick={() => setView("inbox")}>
          Inbox
        </button>
      </nav>
    </div>
  );
}

export default App;
