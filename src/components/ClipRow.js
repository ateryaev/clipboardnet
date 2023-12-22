export function ClipRow({ clip, ...props }) {

  return (
    <div className="flex flex-col cursor-pointer group bg-gray-100x
    p-4 select-none hover:bg-blue-100"
      {...props}>
      <div className="flex justify-between items-baseline">
        <div className="font-sans font-bold uppercase text-md">{clip.code}</div>
        <div className="font-sans font-bold text-xs">
          {clip.exists && new Date(clip.updatedOn).toLocaleString()}
          {!clip.exists && "deleted"}
        </div>
      </div>
      <div className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-md'>
        {clip.exists && clip.text.slice(0, 100)}
        {!clip.exists && <span className="italic text-gray-500">was deleted by creator</span>}
        &nbsp;
      </div>
    </div >
  );
}