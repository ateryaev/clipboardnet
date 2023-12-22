import { useEffect, useRef, useState } from "react";
import { Button, Confirm, Window } from "./Window";

export function PageCreate({ onCancel, onCreate }) {
  const textareaRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(""); //EXIT

  useEffect(() => {
    const ti = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => { clearInterval(ti) };
  }, []);

  function handleInput() {
    setChanged(textareaRef.current.value.trim() !== "");
  }

  async function handleSave() {
    setSaving(true);
    await onCreate(textareaRef.current.value.trim());
    setSaving(false);
  }

  function handleBack() {
    if (textareaRef.current.value.trim() !== "") {
      setConfirmation("EXIT");
    } else {
      onCancel();
    }
  }

  return (
    <Window title={"??????"} disabled={true} onBack={handleBack}>

      {confirmation === "EXIT" && (<Confirm action={"discard creation"} onAction={onCancel}
        onCancel={() => { setConfirmation(null) }}>
        Are you sure you want to exit? It will discard new clipboard creation.
      </Confirm>)}

      <div className="py-0 ps-4 pt-0 items-end uppercase text-xs font-extrabold flex justify-stretch">
        <div className="flex-1 pt-2">
          Creating own clipboard
          <br /><small>
            {!saving && (<>{new Date(currentTime).toLocaleString()}</>)}
            {saving && (<>Processing</>)}
          </small></div>
        <Button disabled={!changed || saving} onClick={handleSave}>create</Button>
      </div>

      <textarea className='min-h-[80px] block flex-1 break-all resize-none
         border-4 border-gray-300 focus:border-gray-400
         p-3 bg-white font-mono 
         disabled:bg-gray-200'
        spellCheck="false"
        ref={textareaRef}
        onInput={handleInput}
        disabled={saving}
      />
    </Window>
  );
}
