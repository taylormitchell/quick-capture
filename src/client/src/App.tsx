import { useEffect, useState } from "react";
import "./App.css";
import { Note, create as createNote } from "./models/Note";
import * as note from "./models/Note";
import Card from "./components/Card";
import Entry from "./components/Entry";
import Stream from "./components/Stream"
import Inbox from "./components/Inbox"

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Load notes
  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((body) => {
        setNotes(body.data.map((n: { [key: string]: any }) => createNote(n)));
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  }, []);

  // Sync notes
  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/notes")
        .then((res) => res.json())
        .then((body) => {
          setNotes((notes) => {
            let res: Note[] = [...notes, ...body.data];
            // drop duplicates, keeping those in client
            res = Array.from(new Map(res.map((n) => [n.id, n])).values());
            return res;
          });
        })
        .catch((err) => console.log(err));
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // Save notes
  useEffect(() => {
    if (!loaded) return;
    fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(notes),
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.log(err));
  }, [notes, loaded]);

  const updateNote = (id: string, values: Partial<Note>) => {
    setNotes((notes) => {
      return notes.map((n) => (n.id === id ? { ...n, ...values } : n));
    });
  };

  const addNote = (text: string) => {
    setNotes((notes) => [...notes, createNote({ text })]);
  };

  const applyToNote = (id: string, f: (n: Note) => Note) => {
    setNotes((notes) => {
      return notes.map((n) => (n.id === id ? f(n) : n));
    });
  }

  type View = "stream" | "inbox";
  const [view, setView] = useState<View>("stream");

  // Set inbox notes
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime()
  const cutoff = today // Date.now() + 0*24*60*60*1000
  const inboxNotes = notes.filter((n) => n.dueDate <= cutoff && n.state === "Active");

  return (
    <div className="App">
      {view === "stream" ? (
        <Stream {...{notes, updateNote, addNote}} />
      ) : (
        <Inbox {...{inboxNotes, updateNote, addNote}} />
      )}
      <nav>
        <button className={view === "stream"? "selected" : ""} onClick={() => setView("stream")}>Input</button>
        <button className={view === "inbox"? "selected" : ""} onClick={() => setView("inbox")}>Process ({inboxNotes.length})</button>
      </nav>
    </div>
  );
}

export default App;
