import { useEffect, useState } from "react";
import "./App.css";
import {v4 as uuidv4} from "uuid";

function Note({ id, text, timestamp }) {
  this.id = id || uuidv4();
  this.text = text || "";
  this.timestamp = timestamp || Date.now();
}

function App() {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load notes
  useEffect(() => {
   fetch("/api/notes")
     .then((res) => res.json())
     .then((body) => {
       setNotes(body.data.map(n => new Note(n)))
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
            let res = [...notes, ...body.data];
            // drop duplicates, keeping those in client 
            res = Array.from(new Map(res.map(n => [n.id, n])).values());
            return res.map(n => new Note(n));
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

  return (
    <div className="App">
      <h1>Quick Capture</h1>
      {/* Add note */}
        <form onSubmit={(e) => {
          e.preventDefault();
          setNotes(notes => [...notes, new Note({text: e.target.text.value})]);
        }}>
          <input id="text" type="text" placeholder="Enter note"/>
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
