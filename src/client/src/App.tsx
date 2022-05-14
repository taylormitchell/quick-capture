import { useEffect, useState } from "react";
import "./App.css";
import { Note, create as createNote } from "./models/Note";
import Stream from "./components/Stream";
import Inbox from "./components/Inbox";
import { useSyncingState } from "./syncHook";

function App() {
  const [notes, setNotes, notesConnected] = useSyncingState<Note[]>([], "notes");

  const updateNote = (id: string, values: Partial<Note>) => {
    setNotes((notes) => {
      return notes.map((n) => (n.id === id ? { ...n, ...values } : n));
    });
  };

  const addNote = (text: string) => {
    setNotes((notes) => [...notes, createNote({ text })]);
  };

  type View = "stream" | "inbox";
  const [view, setView] = useState<View>("stream");

  // Set inbox notes
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const cutoff = today; // Date.now() + 0*24*60*60*1000
  const inboxNotes = notes.filter((n) => n.dueDate <= cutoff && n.state === "Active");

  if(!notesConnected) {
    return <div>Can't connect to server, no app for you :(</div>;
  }
  return (
    <div className="App">
      {view === "stream" ? (
        <Stream {...{notes, updateNote, addNote}} />
      ) : (
        <Inbox {...{inboxNotes, updateNote, addNote}} />
      )}
      <nav>
        <button className={view === "stream"? "selected" : ""} onClick={() => setView("stream")}>Entry</button>
        <button className={view === "inbox"? "selected" : ""} onClick={() => setView("inbox")}>Inbox</button>
      </nav>
    </div>
  );
}

export default App;
