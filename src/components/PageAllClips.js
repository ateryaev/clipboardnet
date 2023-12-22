import { useState } from "react";
import { ClipRow } from "./ClipRow";
import { UserContext } from './UserContext';
import { Window } from './Window';
import { DialogSearch } from "./DialogSearch";

export function PageAllClips({ owns, subs, recentKeys, onCreate, onView, onEdit, onWantSearch }) {

  const [search, setSearch] = useState(false);
  function handleMenuAction(action) {
    if (action === "create own clipboard") {
      onCreate();
    } else {
      //setSearch(true);
      onWantSearch();
    }
  }

  return (
    <>
      {search && (
        <DialogSearch onCancel={() => { setSearch(false) }} onFound={(code) => { onView(code) }} />
      )}

      <Window
        title={(<span>Clipboards</span>)}
        actions={["create own clipboard", "search for others"]}
        onAction={handleMenuAction}
      >
        <div className="py-0 px-4 pt-2 uppercase text-xs font-extrabold">My own clipboards</div>
        <div className='bg-white border-4 border-gray-300'>
          {Object.keys(owns).map((code) => (
            <ClipRow key={code} clip={owns[code]} onClick={() => onEdit(code)} />
          ))}
          {Object.keys(owns).length === 0 && (
            <div className="flex-1 p-4 text-gray-400 text-center">no clipboards</div>
          )}
        </div>

        <div className="py-0 px-4 pt-4 uppercase text-xs font-extrabold">Subscriptions</div>
        <div className='bg-white border-4 border-gray-300'>

          {Object.keys(subs).map((code) => (
            <ClipRow key={code} clip={subs[code]} onClick={() => onView(code)} />
          ))}
          {Object.keys(subs).length === 0 && (
            <div className="flex-1 p-4 text-gray-400 text-center">no subscriptions</div>
          )}

        </div>
      </Window>

    </>);
}