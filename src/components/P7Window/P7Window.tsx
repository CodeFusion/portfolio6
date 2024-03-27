import './P7Window.css';
import {useDraggable} from "@dnd-kit/core";
import React, {CSSProperties, PropsWithChildren, useRef, useState} from "react";
import {useWindowManager} from "../../state/windowManager.ts";

export type P7WindowProps = {
  id: string
  title: string
  overlay?: boolean
  position: {
    x: number
    y: number
  },
  appData?: {
      [prop: string]: string
  }
}

export const P7Window = ({id, title, overlay, position, children}: PropsWithChildren<P7WindowProps>) => {
  const winRef = useRef<HTMLElement>(null)
  const {attributes, listeners, setNodeRef} = useDraggable({id, data: {winRef}})
  const [contentVisible, setContentVisible] = useState(false)
  const removeWindow = useWindowManager((state) => state.removeWindow)

  const positionStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  }

  const dragStyle =  overlay ? {
    border: '2px dotted black',
    color: 'transparent',
    background: 'transparent'
  } : {
    border: '2px solid black'
  }

  const contentStyle: CSSProperties = overlay ?
    { visibility: 'hidden' } : { visibility: 'visible' }

  const windowStyle: CSSProperties = contentVisible ?
    { display: 'none', height: '0px' } : { display: 'block' }

  const hideListener = (e: React.MouseEvent<HTMLElement>) => {
    setContentVisible(!contentVisible)
    e.preventDefault()
    return false;
  }

  const setRef = (elem: HTMLDivElement | null) => {
    setNodeRef(elem)
    // @ts-expect-error - current is not read-only
    winRef.current = elem
  }

  return (
    <div className="absolute z-40 cursor-default" style={{...dragStyle, ...positionStyle}}
         ref={setRef} {...attributes}>
      <div className="hard-shadow bg-white" style={{...contentStyle}}>
        <div className="titlebar"> {/* Titlebar */}
          <div className="titlebar-handle" {...listeners} onDoubleClick={hideListener}></div>
          <button className="p7w-close" onClick={() => removeWindow(id)}></button>
          <span className="p7w-title text-nowrap">{title}</span>
          <button className="p7w-shrink"></button>
        </div>
        <div className="bg-white relative"
             style={{ borderTop: '2px solid black', ...windowStyle}}>
          {children}
        </div>
      </div>
    </div>
  )
}
