import { useEffect } from "react";
import { ClipRow } from "./ClipRow";
import { DialogSearch } from "./DialogSearch";
import { Window } from './Window';
import { useLocation, useNavigate } from "react-router-dom";

function ClipsBlock({ children, codes, onSelect }) {
  return (<>
    <div className="py-0 px-4 pt-2 uppercase text-xs font-extrabold">{children}</div>
    <div className='bg-white border-4 border-gray-300'>
      {codes.map((code) => (
        <ClipRow key={code} code={code} onClick={() => onSelect(code)} />
      ))}
      {codes.length === 0 && (
        <div className="flex-1 p-4 text-gray-400 text-center">no clipboards</div>
      )}
    </div></>)
}

export function PageAllClips({ owns, subs, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { document.title = "Clipboards Console" }, []);

  function handleMenuAction(action) {
    if (action === "create own clipboard") {
      navigate(`/create`);
    } else {
      navigate("", { state: { dialog: "search" } });
    }
  }

  return (
    <>
      {location.state && location.state.dialog === "search" && (<DialogSearch />)}
      <Window
        title={(<span>Clipboards</span>)}
        actions={["create own clipboard", "search for others"]}
        onAction={handleMenuAction}
        {...props}
      >

        <ClipsBlock codes={owns} onSelect={(code) => { navigate(`/edit/${code}`) }}>My own clipboards</ClipsBlock>
        <ClipsBlock codes={subs} onSelect={(code) => { navigate(`/watch/${code}`) }}>Subscriptions</ClipsBlock>

      </Window>
    </>);
}
