import { Modal, WButton } from "./Window"
import * as Svg from './Svg'
import { useEffect, useRef, useState } from "react";
import { getClip } from "../utils/firebase";

export function DialogSearch({ onCancel, onFound }) {
  const searchInput = useRef(null);
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState("");

  function handleInput() {
    let c = searchInput.current.value;
    c = c.trim();
    c = c.toUpperCase();
    setCode(c);
  }

  async function handleSearchClick() {
    if (code.length < 5) return;
    setSearching(true);
    setStatus("Searching");
    const clip = await getClip(code);

    if (!clip) {
      setStatus(`Clipboard #${code} was not found!`);
    } else {
      setStatus("");
      onFound(code);
    }
    setSearching(false);
  }
  return (<Modal title="search by code" icon={<Svg.Zoom />} bg="blue-500" fg="gray-200"
    onCancel={onCancel} >
    <div className="text-center text-gray-500 font-bold text-xs mb-[-10px]">{status}</div>
    <input ref={searchInput}
      onInput={handleInput}
      autoFocus
      spellCheck="false"
      onKeyDown={(e) => { e.code === "Enter" && handleSearchClick() }}
      className="text-black p-2 font-sans font-bold uppercase text-md block
              border-4 border-gray-300 text-center
              disabled:text-gray-500
               placeholder:text-xs
               focus:border-gray-400"
      maxLength={6}
      disabled={searching}
      placeholder="6-symbols code" />

    <div className="text-xs font-extrabold p-0 flex justify-center xh-[40px]">
      <WButton onClick={handleSearchClick} disabled={searching || code.length < 5}>search clipboard</WButton>

    </div>
  </ Modal>)
}