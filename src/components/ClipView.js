
import { createClipLoader, removeListner } from "../utils/firebase";
import { useEffect, useState } from "react";

export function ClipView({ clipKey, color, ...props }) {

  const [data, setData] = useState({ text: "loading..." });

  useEffect(() => {
    console.log("ClipRow STARTUP!", clipKey);

    const clipLoader = createClipLoader(clipKey, (clip) => {
      console.log("Clip loaded!", clip);
      if (clip)
        setData(clip);
      else
        setData({ text: "not found" });
    });

    return () => {
      removeListner(clipLoader);
    }
  }, [clipKey]);

  return (
    <>

      <div className='grid-cols-1 grid gap-0 p-0 my-4  text-sm'>

        {/* <div className="p-2 text-white bg-black
                self-centerfont-semibold w-fit" style={{ background: "#840" }}>
          {clipKey.split("").map((chr, index) => (
            <span className='inline-block w-[16px] text-center'>{chr}</span>
          ))}
        </div> */}

        <div className='border-4 rounded-md border-[rgba(0,0,0,0.2)] p-2 bg-white shadow-inner font-mono h-[20ch]'>
          {data.text}
        </div>
        <div className="p-2 text-center text-[11px] font-mono text-black font-bold opacity-40">{new Date().toLocaleString()}</div>
      </div>
    </>

    // <div className="flex justify-between p-[2px] bg-white gap-[2px]
    //         border-2 border-black hover:shadow-md cursor-pointer
    //         hover:bg-yellow-50"
    //   style={{ borderColor: color }}
    // >
    //   <div className="p-2 text-white bg-black
    //            self-centerfont-semibold" style={{ background: color }}>
    //     {clipKey.split("").map((chr, index) => (
    //       <span className='inline-block w-[16px] text-center'>{chr}</span>
    //     ))}
    //   </div>

    //   <div className='p-2 ps-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap
    //           bg-gray-0 font-mono'>
    //     {data.text.slice(0, 100)}
    //   </div>
    // </div >
  );
}