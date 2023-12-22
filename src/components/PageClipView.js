import { useRef, useState } from "react";
import { Button, Window } from "./Window";

export function PageClipView({ clip, subscribed, onSubscribeChange, onCancel }) {
  const textareaRef = useRef(null);
  const [saving, setSaving] = useState(false);


  async function handleSubscibe() {
    setSaving(true);
    await onSubscribeChange();
    setSaving(false);
  }

  return (
    <Window title={clip.code} onBack={onCancel}>
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
        defaultValue={clip.text}
        ref={textareaRef}
        readOnly />
    </Window >
  );
}
