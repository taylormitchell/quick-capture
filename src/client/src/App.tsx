import { useEffect, useState } from "react";
import "./App.css";
import {v4 as uuidv4} from "uuid";

type Note = {
  id: string,
  text: string,
  timestamp: number
}

function createNote(text: string): Note {
  return { id: uuidv4(), text: text, timestamp: Date.now() }
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entry, setEntry] = useState<string>("");

  // Load notes
  useEffect(() => {
   fetch("/api/notes")
     .then((res) => res.json())
     .then((body) => {
       setNotes(body.data)
       setLoaded(true)
     })
     .catch(err => console.log(err));
  }, []);

  // Sync notes
  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/notes")
        .then((res) => res.json())
        .then((body) => {
          setNotes(notes => {
            let res: Note[] = [...notes, ...body.data];
            // drop duplicates, keeping those in client 
            res = Array.from(new Map(res.map(n => [n.id, n])).values());
            return res
          })
        })
        .catch(err => console.log(err));
      }, 5000);

    return () => clearInterval(id);
  }, []);

  // Save notes
  useEffect(() => {
    if(!loaded) return
    fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(notes),
      headers: { "Content-Type": "application/json" },
    })
    .catch(err => console.log(err));
  }, [notes, loaded]);

  const entrySubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotes(notes => [...notes, createNote(entry)]);
    setEntry("")
  } 

  const entryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntry(e.currentTarget.value);
  }

  return (
    <div className="App">
      <h1>Quick Capture</h1>
      {/* Add note */}
        <form onSubmit={entrySubmitHandler}>
          <input id="text" type="text" placeholder="Enter note" value={entry} onChange={entryChangeHandler}/>
          <input type="submit" value="Submit"/>
        </form>
      {/* List notes */}
      {notes.slice().reverse().map((note) => (
        <div key={note.id}>
          <p>{note.text}</p>
          <p style={{fontSize: "0.2em"}}>{(new Date(note.timestamp)).toISOString()}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
