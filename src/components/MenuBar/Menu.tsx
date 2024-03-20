import {MenuItem, MenuItemProps} from "./MenuItem.tsx";
import React, {useRef, useState} from "react";

export interface MenuProps {
    name: string;
    items: MenuItemProps[];
}

export const Menu = ({name, items}: MenuProps) => {
    const buttonRef = useRef<HTMLButtonElement|null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const onMouseDown = (e: MouseEvent) => {
        buttonRef.current?.focus();
        setIsOpen(true);
        document.addEventListener('mouseup', onMouseUp, {once: true})
    }

    const onMouseUp = (e: MouseEvent) => {
        buttonRef.current?.blur();
        setIsOpen(false);
    }

    return (
        <div className="relative" onMouseDown={onMouseDown}>
            <button className="inline px-3 cursor-default whitespace-nowrap focus:bg-black focus:text-white" ref={buttonRef}>
                {name}
            </button>
            {isOpen && (
                <div className="absolute top-full bg-white border-2 border-black hard-shadow">
                    {items.map((item) => <MenuItem name={item.name} shortcut={item.shortcut} disabled={item.disabled} />)}
                </div>
            )}
        </div>
    )
}