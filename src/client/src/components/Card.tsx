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
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div id={note.id} className="card">
      <main>
        <section>
          <p>{note.text}</p>
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
    </div>
  );
}

export default Card;
