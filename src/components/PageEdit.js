import { createClipLoader, deleteClip, sleep, updateClip } from "../utils/firebase";
import { useEffect, useRef, useState } from "react";
import { Button, Confirm, Window } from "./Window";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function DialogDelete({ code, onCancel, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    //await sleep(1000);
    await deleteClip(code);
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

export function PageEdit({ onCancel, onSelectConfirmExit, onSelectDelete, ...props }) {

  const textRef = useRef(null);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const routerParam = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [clip, setClip] = useState({});
  useEffect(() => createClipLoader(routerParam.code, setClip), [routerParam]);
  useEffect(() => { document.title = `Editing ${routerParam.code}` }, [routerParam]);
  useEffect(() => {
    handleInput();
  }, [clip]);

  function handleInput() {
    setChanged(textRef.current.value !== clip.text);
  }

  async function handleSave() {
    setSaving(true);
    const text = textRef.current.value.trim();
    textRef.current.value = text;
    await updateClip(routerParam.code, text);
    setSaving(false);
  }

  return (
    <>
      {location.state === "delete" && (<DialogDelete
        code={routerParam.code}
        onDeleted={() => navigate("/", { replace: true })}
        onCancel={() => navigate(-1)} />)}

      {location.state === "confirm" && (<DialogConfirmExit
        onConfirm={() => navigate("/", { replace: true })}
        onCancel={() => navigate(-1)} />)}

      <Window title={routerParam.code} {...props}
        disabled={saving || location.state}
        onBack={() => { if (changed) navigate("", { state: "confirm" }); else navigate("/"); }}
        onAction={() => { navigate("", { state: "delete" }); }}
        actions={clip.exists ? ["delete clipboard"] : null}>

        <div className="py-0 ps-4 pt-0 items-end uppercase text-xs font-extrabold flex justify-stretch">
          <div className="flex-1 pt-2">
            Editing clipboard
            <br /><small>
              {!saving && (<>{clip.exists ? new Date(clip.updatedOn).toLocaleString() : "clipboard not found"}</>)}
              {saving && (<>Processing</>)}
            </small></div>

          <Button disabled={!changed} onClick={handleSave}>save changes</Button>
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
          disabled={!clip.exists}
        />
      </Window ></>);
}
