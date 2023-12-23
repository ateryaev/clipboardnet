import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Window } from "./Window";
import { createClipLoader, createSubClipsLoader, updateSubscription } from "../utils/firebase";

export function PageWatch({ code, subscribed, onCancel }) {
  const textareaRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [clip, setClip] = useState({});
  useEffect(() => createClipLoader(code, setClip), [code]);

  async function handleSubscibe() {
    setSaving(true);
    await updateSubscription(code, !subscribed);
    setSaving(false);
  }

  return (
    <Window title={code} onBack={onCancel}>
      <div className="py-0 ps-4 items-end uppercase text-xs font-extrabold flex justify-stretch">
        <div className="flex-1 pt-2">Watching clipboard
          <br />
          <small>
            {saving && "processing"}
            {!saving && !clip.exists && "clipboard not found"}
            {!saving && clip.exists && new Date(clip.updatedOn).toLocaleString()}
          </small>
        </div>
        {!subscribed && (<Button onClick={handleSubscibe} disabled={saving}>subscribe</Button>)}
        {subscribed && (<button onClick={handleSubscibe}
          className="bg-gray-100 p-3 uppercase text-green-600 disabled:opacity-10
            hover:bg-gray-50"
          disabled={saving}>subscribed</button>)}
      </div>
      <textarea className='border-4 min-h-fit block flex-1 break-all resize-none
         border-gray-400 p-3 bg-gray-100 font-mono'
        spellCheck="false"
        value={clip.text}
        ref={textareaRef}
        readOnly />
    </Window >
  );
}
