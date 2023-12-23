import { createClipLoader, deleteClip, sleep, updateClip } from "../utils/firebase";
import { useEffect, useRef, useState } from "react";
import { Button, Confirm, Window } from "./Window";

export function DialogDelete({ code, onCancel, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteClip(code);
    //await sleep(1000);
    onDeleted(code);
  }

  return (<Confirm action={"delete clipboard"}
    onAction={handleDelete}
    onCancel={onCancel}
    disabled={deleting}>
    {deleting && "Deleting..."}
    {!deleting && "Are you sure you want to delete the clipboard? The key can be reused by someone else later."}
  </Confirm>)
}

export function DialogConfirmExit({ onCancel, onConfirm }) {
  return (
    <Confirm action={"discard changes"} onAction={onConfirm}
      onCancel={onCancel}>
      Are you sure you want to exit? If you exit all your changes will be lost.
    </Confirm>)
}

export function PageEdit({ code, onCancel, onSelectConfirmExit, onSelectDelete }) {

  const textRef = useRef(null);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  const [clip, setClip] = useState({});
  useEffect(() => createClipLoader(code, setClip), [code]);

  useEffect(() => {
    handleInput();
  }, [clip]);

  function handleInput() {
    setChanged(textRef.current.value !== clip.text);
  }

  async function handleSave() {
    setSaving(true);
    await updateClip(code, textRef.current.value.trim());
    setSaving(false);
  }

  return (
    <Window title={code} disabled={true}
      onBack={() => { if (changed) onSelectConfirmExit(); else onCancel(); }}
      onAction={() => onSelectDelete(code)}
      actions={["delete clipboard"]}>

      <div className="py-0 ps-4 pt-0 items-end uppercase text-xs font-extrabold flex justify-stretch">
        <div className="flex-1 pt-2">
          Editing clipboard
          <br /><small>
            {!saving && (<>{clip.exists ? new Date(clip.updatedOn).toLocaleString() : "deleted"}</>)}
            {saving && (<>Processing</>)}
          </small></div>

        <Button disabled={!changed || saving} onClick={handleSave}>save changes</Button>
      </div>

      <textarea className='min-h-[80px] block flex-1 break-all resize-none
         border-4 border-gray-300 focus:border-gray-400
         p-3 bg-white font-mono 
         disabled:bg-gray-200'
        spellCheck="false"
        autoCapitalize="false"
        autoFocus
        defaultValue={clip.text}
        ref={textRef}
        onInput={handleInput}
        disabled={saving}
      />
    </Window >);
}
