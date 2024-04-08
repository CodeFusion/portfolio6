import './P7Window.css';
import {useDraggable} from "@dnd-kit/core";
import React, {CSSProperties, PropsWithChildren, useEffect, useRef, useState} from "react";
import {useWindowManager} from "../../state/windowManager.ts";
import {useShallow} from "zustand/react/shallow";
import {Resizable, ResizeCallbackData} from "react-resizable";
import {OverlayScrollbars} from "overlayscrollbars";
import "@/portfolio7scrollbars.css";
import {ScrollbarButtonPlugin} from "../../utils/ScrollbarButtonPlugin.ts";
import {deepCopy} from "../../utils";

OverlayScrollbars.plugin(ScrollbarButtonPlugin);

export type P7WindowProps = {
  id: string
  title: string
  position: {
    x: number
    y: number
  },
  size: {
    width: number
    height: number
  },
  scrollable: boolean,
  appData?: {
      [key: string]: string
  }
}

export const P7Window = ({id, title, position, size, scrollable, children}: PropsWithChildren<P7WindowProps>) => {
  const resizeRef = useRef<HTMLDivElement | null>(null)
  const winRef = useRef<HTMLElement|null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const {attributes, listeners, setNodeRef, setActivatorNodeRef} = useDraggable({id, data: {winRef: winRef.current}})
  const [contentVisible, setContentVisible] = useState(true)
  const [resizeDimensions, setResizeDimensions] = useState({width: size.width, height: size.height})
  const [settledDimensions, setSettledDimensions] = useState({width: size.width, height: size.height})
  const [resizeActive, setResizeActive] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const {windows, setWindow} = useWindowManager(
    useShallow((state) => ({
      windows: state.windows, setWindow: state.setWindow
    }))
  );

  const {topZIndex, focus, setFocus, removeWindow} = useWindowManager(
    useShallow((state) => ({
      topZIndex: state.topZIndex,
      focus: state.focus,
      setFocus: state.setFocus,
      removeWindow: state.removeWindow
    }))
  );
  const [zIndex, setZIndex] = useState(topZIndex);

  const positionStyle = maximized ? {
      left: '0px',
      top: '0px',
      zIndex: zIndex,
      width: 'calc(100% - 150px)',
      height: '100%'
    } : {
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: zIndex,
      width: scrollable ? `${settledDimensions.width}px` : 'auto',
      height: (contentVisible && scrollable) ? `${settledDimensions.height}px` : 'auto'
    }

  const windowStyle: CSSProperties = contentVisible ?
    { display: 'block' } : { display: 'none', height: '0px' }

  const focused = focus === id ? 'focused' : '';
  const scrollableClass = scrollable ? 'scrollable' : 'unscrollable';

  const hideListener = (e: React.MouseEvent<HTMLElement>) => {
    setContentVisible(!contentVisible)
    e.preventDefault()
    return false;
  }

  const setRef = (elem: HTMLDivElement | null) => {
    setNodeRef(elem)
    winRef.current = elem
  }

  const handleFocus = (e: React.FocusEvent) => {
    setFocus(id)
    e.stopPropagation()
  }

  useEffect(() => {
    if (focus === id && zIndex !== topZIndex) {
      setZIndex(topZIndex)
    }
  }, [focus])

  const onResizeStart = () => {
    if (maximized) {
      const rect = winRef.current!.getBoundingClientRect()
      setResizeDimensions({width: rect.width, height: rect.height})
    }
    setResizeActive(true)
  }

  const onResize = (_: React.SyntheticEvent, data: ResizeCallbackData) => {
    setResizeDimensions({width: data.size.width, height: data.size.height})
  }

  const onResizeStop = (_: React.SyntheticEvent, data: ResizeCallbackData) => {
    setSettledDimensions(data.size)
    setResizeActive(false)
    if (maximized) {
      const win = deepCopy(windows.find((win) => win.id === id))
      if (win == undefined) return;

      win.position.x = 0;
      win.position.y = 0;
      win.size = data.size;

      setWindow(win.id, win)
      setMaximized(false)
    }
  }

  useEffect(() => {
    if (scrollable) {
      OverlayScrollbars({
        target: contentRef.current!
      }, {
        overflow: {
          x: 'scroll',
          y: 'scroll'
        },
        scrollbars: {
          theme: 'portfolio7-scrollbars',
          autoHide: 'never',
          visibility: 'visible'
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = () => (
    <div
      className={"absolute cursor-default p7window border-2 border-black box-border flex flex-col hard-shadow bg-white " + focused}
      style={{...positionStyle}}
      ref={setRef} onFocus={handleFocus} tabIndex={0}>

      { /* Titlebar */}
      <div className="titlebar">
        <div className="titlebar-handle cursor-default" ref={setActivatorNodeRef} {...attributes} {...listeners}
             onDoubleClick={hideListener}></div>
        <button className="p7w-close" onClick={() => removeWindow(id)}></button>
        <span className="p7w-title text-nowrap">{title}</span>
        <button className={"p7w-shrink " + (scrollable ? "visible" : "invisible")} onClick={() => setMaximized(!maximized)}></button>
      </div>
      { /* Content */}
      <div style={{borderTop: '2px solid black', ...windowStyle}} className={"p7w-content bg-white flex " + scrollableClass}
           ref={contentRef}>
        {children}
      </div>
      {resizeActive &&
          <div className={"absolute resize-shell"}
               style={{top: -2, left: -2, ...resizeDimensions}}
          >
              <div className={"titlebar"}></div>
              <div className={"vert-scroll"}></div>
              <div className={"horiz-scroll"}></div>
          </div>
      }
    </div>
  )

  if (scrollable) {
    return (
      <Resizable width={resizeDimensions.width} height={resizeDimensions.height}
                 handle={<div className={"resize-button"} style={windowStyle} ref={resizeRef}></div>}
                 minConstraints={[250, 150]}
                 onResize={onResize} onResizeStop={onResizeStop} onResizeStart={onResizeStart}>
        {content()}
      </Resizable>
    )
  } else {
    return (<>
      {content()}
    </>)
  }
}
