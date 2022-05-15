import Note from "../models/Note";
import Card from "../components/Card";

type Props = {
  notes: Note[];
  applyToNote: (id: string, fn: (n: Note) => Note) => void;
};

const Stream = (props: Props) => {
  return (
    <div className="stream column">
      {props.notes
        .slice()
        .reverse()
        .map((n) => (
          <Card key={n.id} note={n} applyToNote={props.applyToNote} />
        ))}
    </div>
  );
};

export default Stream;
