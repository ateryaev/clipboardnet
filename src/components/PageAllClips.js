import { createOwnClipsLoader, createSubClipsLoader, getClip, removeListner, updateUser } from "../utils/firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { ClipRow } from "./ClipRow";
import { UserContext } from './UserContext';
import { Button, Confirm, Modal, WButton, Window } from './Window';
import * as Svg from './Svg'
import { DialogSearch } from "./DialogSearch";

export function PageAllClips({ ownKeys, subKeys, recentKeys, onCreate, onView, onEdit }) {

  const [search, setSearch] = useState(false);


  return (
    <>
      {search && (
        <DialogSearch onCancel={() => { setSearch(false) }} onFound={(code) => { onView(code) }} />
      )}

      <Window
        title={(<span>Clipboards</span>)}
        actions={["create own clipboard", "search for others"]}
        onAction={() => { setSearch(true) }}
      >
        <div className="py-0 px-4 pt-2 uppercase text-xs font-extrabold">My own clipboards</div>
        <div className='bg-white border-4 border-gray-300'>
          {ownKeys.map((key, index) => (
            <ClipRow clipKey={key} key={key} color="#840" onClick={() => onEdit(key)} />
          ))}
          {ownKeys.length === 0 && (
            <div className="flex-1 p-4 text-gray-400 text-center">no clipboards</div>
          )}
        </div>

        <div className="py-0 px-4 pt-4 uppercase text-xs font-extrabold">Subscriptions</div>
        <div className='bg-white border-4 border-gray-300'>
          {subKeys.map((key, index) => (
            <ClipRow clipKey={key} key={key} color="#840" onClick={() => onView(key)} />
          ))}
          {subKeys.length === 0 && (
            <div className="flex-1 p-4 text-gray-400 text-center">no subscriptions</div>
          )}
        </div>
      </Window>

    </>);
}