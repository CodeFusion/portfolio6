import './P7File.css';
import {useDraggable} from "@dnd-kit/core";
import {createPhoenixWindow} from "../../utils";
import React, {useState} from "react";
import {createTextViewerWindow} from "../../utils/windowUtils.ts";
import {useShallow} from "zustand/react/shallow";
import {useFileSystem} from "../../state/fileSystem.ts";

export type P7FileProps = {
    id: string,
    type: 'text' | 'link' | 'folder'
    name: string;
    icon: string;
    iconDrag?: string;
    path?: string;
    position: {
        x: number,
        y: number
    },
    overlay?: boolean,
}

export const P7File = ({id, name, type, path, icon, iconDrag, position, overlay}: P7FileProps) => {
    const {attributes, listeners, setNodeRef} = useDraggable({id})
    const {topZIndex, incrementZIndex, focus} = useFileSystem(
      useShallow((state) => ({
          incrementZIndex: state.incrementZIndex,
          topZIndex: state.topZIndex,
          focus: state.focus,
          setFocus: state.setFocus
      }))
    );
    const [zIndex, setZIndex] = useState(topZIndex);

    const handleDoubleClick = (e: React.MouseEvent) => {
        switch (type) {
            case "folder":
                createPhoenixWindow(name, path!)
                break;
            case "link":
                window.open(path!, '_blank')?.focus()
                break;
            case "text":
                createTextViewerWindow(path!)
                break;
            default:
                e.preventDefault()
                return false
        }
    }

    const style = (position.x >= 0) ?{
        left: `${position.x}px`,
        right: 'unset',
        top: `${position.y}px`,
        zIndex: zIndex
    } : {
        left: 'unset',
        right: `${Math.abs(position.x)}px`,
        top: `${position.y}px`,
        zIndex: zIndex
    }

    const dragStyle =  overlay ? {
        border: '2px dotted black',
        color: 'transparent',
        background: 'transparent',
        zIndex: '900000 !important'
    } : undefined

    const handleOnFocus = () => {
        if (!overlay) {
            incrementZIndex()
            setZIndex(topZIndex)
        }
    }

    const focusedClass = focus.includes(id) ? 'focused' : '';

    return (
        <div ref={setNodeRef}
             id={id}
             style={{...style}}
             {...listeners}
             {...attributes}
             className={"inline-flex flex-col items-center group absolute p7file " + focusedClass}
             tabIndex={0}
             onDoubleClick={handleDoubleClick}
             onFocus={handleOnFocus}
        >
            <img src={overlay ? iconDrag ?? icon : icon} alt={name} className="w-full fileicon group-focus:brightness-50" />
            <div className="px-1 bg-white leading-none text-lg text-nowrap filename" style={dragStyle}>{name}</div>
        </div>
)
}
