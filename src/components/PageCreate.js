import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Confirm, Window } from "./Window";
import { addClip } from "../utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";

export function PageCreate() {
  const textareaRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [saving, setSaving] = useState(false);
  const [text, setText] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const ti = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => { clearInterval(ti) };
  }, []);

  useEffect(() => {
    if (location.state && location.state.text) setText(location.state.text);
  }, [location]);

  const changed = useMemo(() => {
    return text.trim() !== "";
  }, [text]);

  function handleInput() {
    const newText = textareaRef.current.value;
    navigate("", { replace: true, state: { text: newText } });
  }

  async function handleCreate() {
    setSaving(true);
    const text = textareaRef.current.value.trim();
    const code = await addClip(text);
    navigate(`/edit/${code}`, { replace: true })
    setSaving(false);
  }

  function handleBack() {
    if (changed) {
      navigate("", { state: { dialog: "confirm" } });
    } else {
      navigate("/");
    }
  }

  return (
    <Window title={"??????"} onBack={handleBack}>

      {location.state && location.state.dialog === "confirm" &&
        (<Confirm action={"discard creation"}
          onAction={() => navigate("/", { replace: true })}
          onCancel={() => navigate(-1)}>
          Are you sure you want to exit? It will discard new clipboard creation.
        </Confirm>)}

      <div className="py-0 ps-4 pt-0 items-end uppercase text-xs font-extrabold flex justify-stretch">
        <div className="flex-1 pt-2">
          Creating own clipboard
          <br /><small>
            {!saving && (<>{new Date(currentTime).toLocaleString()}</>)}
            {saving && (<>Processing</>)}
          </small></div>
        <Button disabled={!changed || saving} onClick={handleCreate}>create</Button>
      </div>

      <textarea className='min-h-[80px] block flex-1 break-all resize-none
         border-4 border-gray-300 focus:border-gray-400
         p-3 bg-white font-mono 
         disabled:bg-gray-200'
        spellCheck="false"
        autoFocus
        ref={textareaRef}
        onInput={handleInput}
        disabled={saving}
        value={text}
      />
    </Window>
  );
}
