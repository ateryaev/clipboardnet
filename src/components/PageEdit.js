import { createClipLoader, deleteClip, removeListner, updateClip } from "../utils/firebase";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { UserContext } from './UserContext';
import { Button, RButton, Confirm, Window } from "./Window";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export function PageEdit({ clipKey, onCancel }) {

  const ctx = useContext(UserContext);
  const textareaRef = useRef(null);
  const [clip, setClip] = useState({ text: "", updatedOn: 0, createdOn: 0 });
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmation, setConfirmation] = useState(null); //EXIT, DELETE

  useEffect(() => {
    const loader = createClipLoader(clipKey, (clip) => {
      if (clip) setClip(clip);
    });
    return () => {
      removeListner(loader);
    }
  }, [clipKey]);

  useEffect(() => {
    handleInput();
  }, [clip]);

  function handleInput() {
    setChanged(textareaRef.current.value !== clip.text);
  }

  async function handleSave() {
    setSaving(true);
    await sleep(1000);
    const newText = textareaRef.current.value;
    await updateClip(clipKey, newText);
    setSaving(false);
  }

  async function handleDelete() {
    setConfirmation(null);
    setSaving(true);
    await sleep(1000);
    await deleteClip(clipKey);
    setSaving(false);
    onCancel();
  }

  return (
    <>
      {confirmation === "DELETE" && (<Confirm action={"delete clipboard"}
        onAction={handleDelete}
        onCancel={() => { setConfirmation(null) }}>
        Are you sure you want to delete the clipboard? The key can be reused by someone else later.
      </Confirm>)}

      {confirmation === "EXIT" && (<Confirm action={"discard changes"} onAction={onCancel}
        onCancel={() => { setConfirmation(null) }}>
        Are you sure you want to exit? If you exit all your changes will be lost.
      </Confirm>)}

      <Window title={"" + clipKey} disabled={true}
        onBack={() => { changed && setConfirmation("EXIT"); !changed && onCancel(); }}
        onAction={() => setConfirmation("DELETE")}
        actions={["delete clipboard"]}

      >
        <div className="py-0 ps-4 pt-0 items-end uppercase text-xs font-extrabold flex justify-stretch">
          <div className="flex-1 pt-2">
            Editing clipboard
            <br /><small>
              {!saving && (<>{new Date(clip.updatedOn).toLocaleString()}</>)}
              {saving && (<>Processing</>)}
            </small></div>


          <Button disabled={!changed || saving} onClick={handleSave}>save changes</Button>

        </div>

        <textarea className='min-h-[80px] block flex-1 break-all resize-none
         border-4 border-gray-300 focus:border-gray-400
         p-3 bg-white font-mono 
         disabled:bg-gray-200'
          spellCheck="false"
          defaultValue={clip.text}
          ref={textareaRef}
          onInput={handleInput}
          disabled={saving}
        />
      </Window >
    </>
  );
}
