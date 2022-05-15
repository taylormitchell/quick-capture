import Note from "../models/Note";
import Entry from "../components/Entry";
import Card from "../components/Card";

type Props = {
  notes: Note[];
  updateNote: (id: string, values: Partial<Note>) => void;
};

const Stream = (props: Props) => {
  return (
    <div className="stream column">
      {props.notes
        .slice()
        .reverse()
        .map((n) => (
          <Card key={n.id} note={n} updateNote={props.updateNote} />
        ))}
    </div>
  );
};

export default Stream;
