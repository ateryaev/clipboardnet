import { createClipLoader, createSubClipsLoader, deleteClip, removeListner, updateClip, updateUser } from "../utils/firebase";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { UserContext } from './UserContext';
import { Button, RButton, Confirm, Window } from "./Window";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export function PageClipView({ clipKey, subKeys, onCancel }) {

  const ctx = useContext(UserContext);
  const textareaRef = useRef(null);
  const [clip, setClip] = useState({ text: "", updatedOn: 0, createdOn: 0 });
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  const [confirmation, setConfirmation] = useState(null); //EXIT, DELETE

  useEffect(() => {
    console.log("CLIP EFFECT");
    const clipLoader = createClipLoader(clipKey, async (clip) => {
      await sleep(1000);
      console.log("CLIP", clip);
      setLoading(false);
      if (clip) setClip(clip);
      setExists(clip !== null);
    });
    setSubscribed(subKeys.includes(clipKey));
    return () => {
      removeListner(clipLoader);
    }
  }, [clipKey, subKeys]);

  async function handleSubscibe(subscribe) {
    console.log("SUBSCRIBE!", subscribe);
    let newSubs = [];
    if (subscribe) {
      newSubs = subKeys.slice();
      newSubs.push(clipKey);
    } else {
      newSubs = subKeys.filter((code) => code !== clipKey);
    }

    //updateUser()
    setSaving(true);
    await sleep(1000);
    //const newText = textareaRef.current.value;
    await updateUser(newSubs);
    setSaving(false);
  }

  return (
    <>

      <Window title={clipKey} disabled={true} onBack={onCancel}>

        <div className="py-0 ps-4 items-end uppercase text-xs font-extrabold flex justify-stretch">
          <div className="flex-1 pt-2">Watching clipboard
            <br />
            <small>
              {loading && "loading"}
              {!loading && saving && "processing"}
              {!loading && !saving && !exists && "clipboard not found"}
              {!loading && !saving && exists && new Date(clip.updatedOn).toLocaleString()}
            </small>
          </div>
          {!subscribed && (<Button onClick={() => { handleSubscibe(true) }} disabled={saving}>subscribe</Button>)}
          {subscribed && (<button onClick={() => { handleSubscibe(false) }}
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
    </>
  );
}
