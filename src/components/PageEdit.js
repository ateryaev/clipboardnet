import { useEffect, useRef, useState } from "react";
import { Button, Confirm, Window } from "./Window";

export function PageEdit({ clip, onCancel, onDelete, onEdit }) {

  const textRef = useRef(null);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(null); //EXIT, DELETE

  useEffect(() => {
    handleInput();
  }, [clip]);

  function handleInput() {
    setChanged(textRef.current.value !== clip.text);
  }

  async function handleSave() {
    setSaving(true);
    await onEdit(textRef.current.value);
    setSaving(false);
  }

  async function handleDelete() {
    setConfirmation(null);
    setSaving(true);
    await onDelete();
    setSaving(false);
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

      <Window title={clip.code} disabled={true}
        onBack={() => { changed && setConfirmation("EXIT"); !changed && onCancel(); }}
        onAction={() => setConfirmation("DELETE")}
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
          defaultValue={clip.text}
          ref={textRef}
          onInput={handleInput}
          disabled={saving}
        />
      </Window >
    </>
  );
}
