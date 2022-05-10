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
      });
  }, []);

  // Save notes
  useEffect(() => {
    if(loaded) {
      fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(notes),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((body) => console.log(body));
    }
  }, [notes]);

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
          {/* <p style={{size: "0.3em"}}>{(new Date(note.timestamp)).toISOString()}</p> */}
          <p style={{fontSize: "0.2em"}}>{(new Date(note.timestamp)).toISOString()}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
