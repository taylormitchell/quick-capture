import { useState } from "react";

type Props = {
  addNote: (text: string) => void;
};
const Entry = (props: Props) => {
  const [entry, setEntry] = useState<string>("");

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(e.currentTarget.value);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.addNote(entry);
    setEntry("");
  };

  return (
    <form className="entry" onSubmit={submitHandler}>
      <textarea
        id="text"
        placeholder="Enter note"
        value={entry}
        onChange={changeHandler}
        autoFocus={true}
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default Entry;
