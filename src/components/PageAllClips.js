import { ClipRow } from "./ClipRow";
import { Window } from './Window';

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

export function PageAllClips({ owns, subs, onSelectCreate, onSelectOwn, onSelectSub, onSelectSearch, ...props }) {

  function handleMenuAction(action) {
    if (action === "create own clipboard") {
      onSelectCreate();
    } else {
      onSelectSearch();
    }
  }

  return (
    <Window
      title={(<span>Clipboards</span>)}
      actions={["create own clipboard", "search for others"]}
      onAction={handleMenuAction}
      {...props}
    >
      <ClipsBlock codes={owns} onSelect={onSelectOwn}>My own clipboards</ClipsBlock>
      <ClipsBlock codes={subs} onSelect={onSelectSub}>Subscriptions</ClipsBlock>

    </Window>);
}