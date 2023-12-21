
import { getDatabase, set, ref, update, query, orderByChild, limitToLast, onValue, off, equalTo } from "firebase/database";
import { createClipLoader, removeListner } from "../utils/firebase";
import { useEffect, useState } from "react";

export function ClipRow({ clipKey, color, ...props }) {

  const [clipText, setClipText] = useState("");
  const [clipTime, setClipTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);


  useEffect(() => {
    const loader = createClipLoader(clipKey, (clip) => {
      setLoading(false);
      setExists(clip !== null);
      if (clip) {
        setClipText(clip.text)
        setClipTime(clip.updatedOn);
      }
    });
    return () => {
      removeListner(loader);
    }
  }, [clipKey]);

  return (
    <div className="flex flex-col cursor-pointer group bg-gray-100x
    p-4 select-none hover:bg-blue-100"
      {...props}>
      <div className="flex justify-between items-baseline">
        <div className="font-sans font-bold uppercase text-md">{clipKey}</div>
        <div className="font-sans font-bold text-xs">
          {loading && "loading"}
          {!loading && !exists && "not found"}
          {!loading && exists && new Date(clipTime).toLocaleString()}

        </div>
      </div>
      <div className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-md'>
        {clipText.slice(0, 100)}
        {!loading && !exists && <span className="text-gray-400 italic">Clipboard was deleted by creator</span>}
        &nbsp;
      </div>
    </div >
  );
}