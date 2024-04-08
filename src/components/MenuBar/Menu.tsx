import {MenuItem, MenuItemProps} from "./MenuItem.tsx";
import {useRef, useState} from "react";
import './MenuBar.css';

export interface MenuProps {
    name: string;
    icon?: string;
    items: (MenuItemProps | "separator")[];
    className?: string;
}

export const Menu = ({name, icon, items, className}: MenuProps) => {
    const buttonRef = useRef<HTMLButtonElement|null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        buttonRef.current?.focus();
        setIsOpen(true);
        if (e.type === 'touchstart') {
            document.addEventListener('touchstart', onMouseUp, {once: true})
        } else {
            document.addEventListener('mouseup', onMouseUp, {once: true})
        }
    }

    const onMouseUp = async (e: MouseEvent | TouchEvent) => {
        if ((e.target as Element).classList.contains('menuItem')) {
            (e.target as Element).classList.add('blink');
            setTimeout(() => {
                (e.target as Element).classList.remove('blink');
                buttonRef.current?.blur();
                setIsOpen(false);
            }, 250)
        } else {
            buttonRef.current?.blur();
            setIsOpen(false);
        }
    }

    const renderItem = (item: MenuItemProps | "separator") => {
        if (item === "separator") {
            return <div className="border-b-2 border-b-black border-dotted" key={Math.random()}/>
        } else {
            return <MenuItem name={item.name} shortcut={item.shortcut} disabled={item.disabled} key={item.name} onActivate={item.onActivate}/>
        }
    }

    return (
        <div className={"relative menu " + className} onMouseDown={onMouseDown} onTouchStart={onMouseDown}>
            <button
                className="inline px-3 cursor-default whitespace-nowrap rounded-none h-full
                focus:bg-black focus:text-white
                focus-visible:outline-none touch-manipulation"
                ref={buttonRef}>
                    {icon ? <img src={icon} alt={name} className="systemIcon pointer-events-none"/> : name }
            </button>
                {isOpen && (
                    <div className="absolute top-full bg-white border-2 border-black hard-shadow z-50">
                    {items.map(renderItem)}
                </div>
            )}
        </div>
    )
}
