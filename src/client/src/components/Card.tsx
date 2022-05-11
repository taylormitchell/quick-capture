import React, { useEffect, useRef, useState } from "react";
import { Note } from "../models/Note";

type CardProps = {
  note: Note;
  modify: (n: Partial<Note>) => void;
  keep: () => void;
  archive: () => void;
};

function Card(props: CardProps) {
  const { note } = props;
  const [textEditing, setTextEditing] = useState<string>("");
  const [textEditable, setTextEditable] = useState<boolean>(false);
  const textArea = useRef<HTMLTextAreaElement>(null);

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
    props.modify({ text: textEditing });
    setTextEditable(false);
    setTextEditing("");
  };

  return (
    <div id={note.id} className="card">
      <div className="main">
        <div className="text">
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
        </div>
        <div className="actions">
          <button onClick={props.keep}>Keep</button>
          <button onClick={props.archive}>Archive</button>
        </div>
      </div>
      <div className="details">
        <p>{new Date(note.createdDate).toISOString()}</p>
      </div>
    </div>
  );
}

export default Card;
