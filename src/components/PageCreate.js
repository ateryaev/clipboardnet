import { addClip } from "../utils/firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from './UserContext';
import { Button, Window } from "./Window";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function PageCreate({ onCancel, onCreated }) {

  const ctx = useContext(UserContext);
  const textareaRef = useRef(null);
  const [clip, setClip] = useState({ text: "", updatedOn: new Date().getTime() });
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    const ti = setInterval(() => {
      let newClip = { ...clip };
      newClip.createdOn = newClip.updatedOn = new Date().getTime();
      setClip(newClip);
    }, 1000);
    return () => { clearInterval(ti) };
  }, []);

  function handleInput() {
    setChanged(textareaRef.current.value !== clip.text);
  }

  async function handleSave() {
    setSaving(true);
    //await sleep(1000);
    const newText = textareaRef.current.value;
    const newKey = await addClip(newText);
    onCreated(newKey);
    setSaving(false);
  }

  return (
    <Window title={"my clipboards / ......"}>
      <textarea className='w-full border-2 min-h-fit block flex-1
         border-black p-2 bg-white font-mono shadow-[inset_0_0_0_2px_rgba(0,0,0,0.1)]'
        spellCheck="false"
        defaultValue={clip.text} m-0
        ref={textareaRef}
        onInput={handleInput}
        disabled={saving}
      />
      <div className="flex justify-stretch gap-2">
        <div className="flex-1 text-[10px] font-mono text-left p-0 capitalize opacity-70">
          {!saving && (<>Created On<br />{new Date(clip.updatedOn).toLocaleString()}</>)}
          {saving && (<><br />Creating...</>)}
        </div>
        <Button disabled={!changed || saving} onClick={handleSave}>create new</Button>
        <Button disabled={saving} onClick={onCancel}>cancel</Button>

      </div>
    </Window>
  );
}
