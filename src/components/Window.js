import { useEffect, useState, children } from "react";
import * as Svg from './Svg'

export function Button({ ...props }) {
  return (
    <button
      className='p-3 block whitespace-nowrap
       select-none uppercase text-white bg-black
      [&:not(:disabled):not(:active):hover]:bg-[#444]
      active:bg-white active:text-black
      disabled:opacity-10'
      {...props}
    >
      {props.children}
    </button>
  )
}

export function WButton({ ...props }) {
  return (
    <button
      className='p-3 block
      uppercase text-black bg-white select-none whitespace-nowrap
      [&:not(:disabled):not(:active):hover]:bg-gray-50
      active:bg-black active:text-white
      disabled:opacity-10'
      {...props}
    >
      {props.children}
    </button>
  )
}

export function Confirm({ action, onAction, onCancel, ...props }) {
  return (
    <Modal title="warning" bg="red-500" icon={<Svg.Warning />} fg="gray-200" onCancel={onCancel}>
      <div className="text-center">
        {props.children}
      </div>
      <div className="flex justify-center text-xs font-extrabold">
        <WButton onClick={onAction}>{action}</WButton>
      </div>
    </Modal>
  );
}

export function Header({ bg, onCancel, children, icon, ...props }) {
  return (
    <div className={`bg-${bg} flex justify-between items-center text-white h-[50px]`}>
      {icon && (<div className="uppercase text-sm xbg-white  w-[50px] flex justify-center">
        {icon}
      </div>)}
      {!icon && (<div className="w-4"></div>)}
      <div className="flex-1 px-0 font-sans uppercase text-sm font-bold">
        {children}
      </div>
      <button className="text-white flex w-[50px] h-[50px] items-center justify-center
          hover:opacity-80 hover:bg-[rgba(255,255,255,0.1)]"
        onClick={onCancel}>
        <Svg.Cross />
      </button>
    </div>);
}

export function Overlay({ bgColor, fgColor, ...props }) {
  return (
    <div className={`fixed bg-${bgColor} bg-opacity-50 top inset-0 z-50 flex-col flex items-center justify-center`}>
      <div className={`bg-${fgColor} p-0 max-w-[420px] w-[90%] 
      shadow-sm border-0 border-red-500`}>
        {props.children}
      </div>
    </div >);
}

export function Modal({ icon, title, bg, fg, onCancel, ...props }) {
  return (
    <Overlay bgColor={"black"} fgColor={fg}>
      <Header bg={bg} icon={icon} onCancel={onCancel}>{title}</Header>
      <div className={`p-4 gap-3 flex flex-col border-4 border-t-0 border-${bg}`}>
        {props.children}
      </div>
    </Overlay>
  );
}

export function Window({ title, action, onAction, onBack, children, actions, ...props }) {

  const [actionsShown, setActionsShown] = useState(false);

  return (
    <div disabled tabIndex={-1} className="flex flex-col border-0 border-t-0 border-black min-h-screen" {...props}
      onClick={() => { actionsShown && setActionsShown(false) }}>


      <div className="flex justify-between gap-[0px] items-center bg-[#369] h-[50px]">
        {onBack && (
          <button className="text-white h-[50px] w-[50px] flex items-center justify-center
          hover:text-sky-300 hover:bg-[rgba(255,255,255,0.1)]"
            onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
            </svg>
          </button>
        )}

        {!onBack && (<div className="w-4"></div>)}
        <div className="text-white flex-1 px-1 font-sans uppercase text-md font-bold">
          {title}
        </div>

        {actions && (
          <button className="text-white h-[50px] w-[50px] flex items-center justify-center
          hover:text-sky-300 hover:bg-[rgba(255,255,255,0.1)]"
            onClick={() => { setActionsShown(!actionsShown) }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </button>
        )}
      </div>

      {actions && actionsShown && (
        <div className="flex justify-end">
          <div className="absolute z-20 flex flex-col p-[4px] gap-[4px] bg-white shadow-md text-xs font-extrabold">
            {actions.map((action) => (
              <WButton key={action} onClick={() => { setActionsShown(false); onAction(action) }}>{action}</WButton>
            ))}
          </div>
        </div>
      )}

      <div className="p-2 bg-gray-200 flex-1 flex flex-col gap-2 py-3">{children}</div>
    </div>
  )
}