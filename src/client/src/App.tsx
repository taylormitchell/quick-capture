import { useEffect, useState } from "react";
import "./App.css";
import { Note, create as createNote } from "./models/Note";
import Card from "./components/Card";
import Entry from "./components/Entry";

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

  const modifyNote = (id: string, values: Partial<Note>) => {
    setNotes((notes) => {
      return notes.map((n) => (n.id === id ? { ...n, ...values } : n));
    });
  };

  const addNote = (text: string) => {
    setNotes((notes) => [...notes, createNote({ text })]);
  };

  type View = "stream" | "inbox";
  const [view, setView] = useState<View>("stream");

  return (
    <div className="App">
      {view === "stream" ? (
        <div className="stream">
          <div className="column">
            <div className="notes" style={{ overflow: "scroll" }}>
              {notes
                .slice()
                .reverse()
                .map((note) => (
                  <Card
                    key={note.id}
                    note={note}
                    keep={() => {}}
                    archive={() => {}}
                    modify={(values: Partial<Note>) => modifyNote(note.id, values)}
                  />
                  // <div key={note.id}>
                  //   <p>{note.text}</p>
                  //   <p style={{ fontSize: "0.2em" }}>{new Date(note.createdDate).toISOString()}</p>
                  //   {/* <p style={{ fontSize: "0.2em" }}>{note.createdDate}</p> */}
                  // </div>
                ))}
            </div>
            <Entry addNote={addNote} />
          </div>
        </div>
      ) : (
        <div id="inbox">
          <p>This is the inbox</p>
        </div>
      )}
      <nav>
        <button onClick={() => setView("stream")}>Stream</button>
        <button onClick={() => setView("inbox")}>Inbox</button>
      </nav>
    </div>
  );
}

export default App;
