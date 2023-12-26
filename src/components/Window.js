import { useState } from "react";
import * as Svg from './Svg'

export function Button({ ...props }) {
  return (
    <button
      className='p-3 block whitespace-nowrap
       uppercase text-white bg-black
       enabled:hover:bg-gray-800
      enabled:active:bg-gray-500'
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
      uppercase text-black bg-white whitespace-nowrap
      enabled:hover:bg-gray-100
      enabled:active:bg-gray-300'
      {...props}
    >
      {props.children}
    </button>
  )
}

export function Confirm({ action, onAction, onCancel, disabled, ...props }) {
  return (
    <Modal title="warning" bg="red-500" icon={<Svg.Warning />} fg="gray-200" onCancel={onCancel}>
      <div className="text-center">
        {props.children}
      </div>
      <div className="flex justify-center text-xs font-extrabold">
        <WButton onClick={onAction} disabled={disabled}>{action}</WButton>
      </div>
    </Modal>
  );
}

export function Header({ bg, onCancel, children, icon }) {
  return (
    <div className={`bg-${bg} flex justify-between items-center text-white h-[50px]`}>
      {icon && (<div className="uppercase text-sm  w-[50px] flex justify-center">
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
    <div className={`fixed bg-${bgColor} bg-opacity-50 top inset-0 top-0 left-0 bottom-0 right-0 z-50 flex-col flex items-center backdrop-blur-sm justify-center`}>
      <div className={`bg-${fgColor} p-0 max-w-[420px] w-[90%] 
      shadow-sm border-0 border-red-500`}>
        {props.children}
      </div>
    </div >);
}

export function Modal({ icon, title, bg, fg, onCancel, ...props }) {
  return (
    <Overlay bgColor={"black"} fgColor={fg}>
      {title && <Header bg={bg} icon={icon} onCancel={onCancel}>{title}</Header>}
      <div className={`p-4 gap-3 flex flex-col border-4 border-t-0 border-${bg}`}>
        {props.children}
      </div>
    </Overlay>
  );
}

export function Window({ title, onAction, onBack, children, actions, disabled, hidden }) {

  const [actionsShown, setActionsShown] = useState(false);

  return (
    <fieldset disabled={disabled} hidden={hidden}>
      <div className="flex flex-col h-[100svh]"
        onClick={() => { actionsShown && setActionsShown(false) }}>

        <div className="flex justify-between gap-[0px] items-center bg-[#369] h-[50px]">
          {onBack && (
            <button className="text-white h-[50px] w-[50px] flex items-center justify-center
          hover:text-sky-300 hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-50"
              onClick={onBack}>
              <Svg.Back />
            </button>
          )}

          {!onBack && (<div className="w-4"></div>)}
          <div className="text-white flex-1 px-1 font-sans uppercase text-md font-bold">
            {title}
          </div>

          {actions && (
            <button className="text-white h-[50px] w-[50px] flex items-center justify-center
          hover:text-sky-300 hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-50"
              onClick={() => { setActionsShown(!actionsShown) }}>
              <Svg.More />
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

        <div className="p-2 bg-gray-200 flex-1 flex flex-col gap-2 py-3 overflow-y-scroll ">{children}</div>
      </div>
    </fieldset>
  )
}