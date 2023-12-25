import { Modal, WButton } from "./Window"
import * as Svg from './Svg'
import { useEffect, useMemo, useRef, useState } from "react";
import { getClip } from "../utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";

export function DialogSearch({ }) {
  const searchInput = useRef(null);
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  function handleInput() {
    let newCode = searchInput.current.value;
    newCode = newCode.trim().toUpperCase();
    navigate("", { state: { dialog: "search", code: newCode }, replace: true })
  }
  const searchable = useMemo(() => {
    return !searching && code.trim().length > 4;
  }, [code, searching]);

  useEffect(() => {
    setCode(location.state.code ? location.state.code : "");
  }, [location]);

  async function handleSearchClick() {
    if (code.length < 5) return;
    setSearching(true);
    setStatus("Searching");
    const clip = await getClip(code);

    if (!clip) {
      setStatus(`Clipboard ${code} was not found!`);
    } else {
      setStatus("");
      navigate(`/watch/${code}`, { replace: true });
    }
    setSearching(false);
  }
  return (<Modal title="search by code" icon={<Svg.Zoom />} bg="blue-500" fg="gray-200"
    onCancel={() => { navigate(-1) }} >
    <div className="text-center text-gray-500 font-bold text-xs mb-[-10px]">{status}</div>
    <input ref={searchInput}
      onInput={handleInput}
      value={code}
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

    <div className="text-xs font-extrabold flex justify-center">
      <WButton onClick={handleSearchClick} disabled={!searchable}>search clipboard</WButton>
    </div>
  </ Modal>)
}
