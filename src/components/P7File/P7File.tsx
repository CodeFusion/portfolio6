import './P7File.css';
import {useDraggable} from "@dnd-kit/core";
import {createPhoenixWindow} from "../../utils";
import React from "react";
import {createYukiWindow} from "../../utils/windowUtils.ts";

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
    overlay?: boolean
}

export const P7File = ({id, name, type, path, icon, iconDrag, position, overlay}: P7FileProps) => {
    const {attributes, listeners, setNodeRef} = useDraggable({id})

    const handleDoubleClick = (e: React.MouseEvent) => {
        switch (type) {
            case "folder":
                createPhoenixWindow(name, path!)
                break;
            case "link":
                createYukiWindow(path!)
                break;
            default:
                e.preventDefault()
                return false
        }
    }

    const style = overlay ? undefined : {
        left: `${position.x}px`,
        top: `${position.y}px`,
    }

    const dragStyle =  overlay ? {
        border: '2px dotted black',
        color: 'transparent',
        background: 'transparent',
    } : undefined

    return (
        <div ref={setNodeRef}
             style={{...style}}
             {...listeners}
             {...attributes}
             className="inline-flex flex-col items-center group absolute p7file z-10"
             tabIndex={0}
             onDoubleClick={handleDoubleClick}
        >
            <img src={overlay ? iconDrag ?? icon : icon} alt={name} className="w-full group-focus:brightness-50" />
            <div className="px-1 bg-white leading-none text-lg text-nowrap
                group-focus:bg-black group-focus:text-white" style={dragStyle}>{name}</div>
        </div>
)
}