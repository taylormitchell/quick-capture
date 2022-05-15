import React, { useEffect, useRef, useState } from "react";
import { Note } from "../models/Note";
import * as model from "../models/Note";
import Details from "./Details";

type CardProps = {
  note: Note;
  applyToNote: (id: string, fn: (n: Note) => Note) => void;
  quickActions?: JSX.Element;
};

function Card(props: CardProps) {
  const { note } = props;
  const update = (values: Partial<Note>) => {
    props.applyToNote(note.id, (n) => ({ ...n, ...values }));
  }

  const [textEditing, setTextEditing] = useState<string>("");
  const [textEditable, setTextEditable] = useState<boolean>(false);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Focus when selected
  useEffect(() => {
    let el = textArea.current;
    if (el) {
      const end: number = el.value.length;
      el.focus();
      el.setSelectionRange(end, end);
    }
  }, [textEditable]);

  const textFocusHandler = () => {
    setTextEditable(true);
    setTextEditing(note.text);
  };

  const textBlurHandler = () => {
    update({ text: textEditing });
    setTextEditable(false);
    setTextEditing("");
  };

  return (
    <div id={note.id} className="card">
      <main>
        <section>
          {textEditable ? (
            <textarea
              ref={textArea}
              value={textEditing}
              onChange={(e) => setTextEditing(e.target.value)}
              onBlur={textBlurHandler}
            ></textarea>
          ) : (
            <p onClick={textFocusHandler}> {note.text} </p>
          )}
        </section>
        <footer>
          <Details details={showDetails ? note : { createdDate: note.createdDate }} />
          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => setShowDetails((v) => !v)}
          >
            ...
          </button>
          {props.quickActions}
          {/* <div className="card-main-actions">
            <button onClick={keep}>Keep</button>
            <button onClick={archive}>Archive</button>
            <button onClick={() => {}}>Skip</button>
          </div> */}
        </footer>
      </main>
      {/* <aside>
          <button onClick={keep}>Keep</button>
          <button onClick={archive}>Archive</button>
      </aside> */}
    </div>
  );
}

export default Card;
