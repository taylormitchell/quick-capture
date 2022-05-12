import { useState, useRef } from "react";

type Props = {
  addNote: (text: string) => void;
};
const Entry = (props: Props) => {
  const initialText = ""
  const initialHeight = "auto"
  const [entry, setEntry] = useState<string>(initialText);
  const [height, setHeight] = useState<string>(initialHeight);
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const changeHandler = () => {
    let textArea = textAreaRef.current!;
    setEntry(textArea.value);
    if(textArea.clientHeight < textArea.scrollHeight) {
      setHeight(textArea.scrollHeight + "px")
    } else if(textArea.value === "") {
      setHeight(initialHeight)
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.addNote(entry);
    setEntry(initialText);
    setHeight(initialHeight)
    textAreaRef.current!.focus();
  };


  return (
    <form className="entry" onSubmit={submitHandler}>
      <textarea
        ref={textAreaRef}
        id="text"
        placeholder="Enter note"
        value={entry}
        onChange={changeHandler}
        style={{height: height, overflowY: "hidden"}}
        autoFocus={true}
      />
      <input type="submit" value="↑" />
      {/* <input type="submit" value="Submit" /> */}
    </form>
  );
};

export default Entry;
