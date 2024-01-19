import { useEffect, useMemo, useState } from "react";
import { Button, Window } from "./Window";
import { createClipLoader, createSubsListner, updateSubscription } from "../utils/firebase";
import { useNavigate, useParams } from "react-router-dom";

export function PageWatch({ ...props }) {
  const [saving, setSaving] = useState(false);
  const routerParam = useParams();
  const navigate = useNavigate();
  useEffect(() => { document.title = `Watching ${routerParam.code}` }, [routerParam]);
  const [clip, setClip] = useState({});
  useEffect(() => createClipLoader(routerParam.code, setClip), [routerParam]);

  const [subCodes, setSubCodes] = useState([]);
  useEffect(() => createSubsListner(setSubCodes), []);

  const subscribed = useMemo(() => {
    return subCodes.includes(routerParam.code);
  }, [subCodes]);

  async function handleSubscibe() {
    setSaving(true);
    await updateSubscription(routerParam.code, !subscribed);
    setSaving(false);
  }

  const words = useMemo(() => {
    if (!clip.text) return [];
    const prewords = clip.text.replaceAll("\n", " \n").split(/[ \t]/);
    return prewords.map((word) => {
      if (word.trim().indexOf("https://") === 0) {
        return <><a className="group text-blue-600 hover:underline
        focus-visible:bg-blue-600 focus-visible:text-white"
          target="_blank" href={word}>{word}</a> </>
      }
      return <>{word} </>;
    })
  }, [clip]);


  return (
    <Window title={routerParam.code}
      onBack={() => { navigate("/"); }}
      disabled={saving || props.disabled} {...props}>

      <div className="py-0 ps-4 items-end uppercase text-xs font-extrabold flex justify-stretch">
        <div className="flex-1 pt-2">Watching clipboard
          <br />
          <small>
            {saving && "processing"}
            {!saving && !clip.exists && "clipboard not found"}
            {!saving && clip.exists && new Date(clip.updatedOn).toLocaleString()}
          </small>
        </div>
        {!subscribed && (<Button onClick={handleSubscibe}>subscribe</Button>)}
        {subscribed && (<button onClick={handleSubscibe}
          className="bg-white p-3 uppercase text-green-600 
          enabled:hover:bg-gray-100 enabled:active:bg-gray-300">subscribed</button>)}
      </div>
      <div className='border-4 min-h-fit block flex-1 break-all resize-none
         border-gray-300 p-3 bg-gray-100 font-mono focus:border-gray-400
         whitespace-pre-wrap'


        disabled={!clip.exists}
        readOnly>
        {words}</div>
    </Window >
  );
}
