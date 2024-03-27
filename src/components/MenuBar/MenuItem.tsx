import './MenuBar.css';

export interface MenuItemProps {
    name: string;
    shortcut?: string | undefined;
    disabled: boolean;
}

export const MenuItem = ({name, shortcut, disabled}: MenuItemProps) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcutSymbol = isMac ? '⌘' : '^';

    return (
        <button className="menuItem cursor-default enabled:hover:bg-black enabled:hover:text-white whitespace-nowrap pl-4 pr-2 flex w-full disabled:text-gray-500 disabled:pointer-events-none" disabled={disabled}>
            <span className="flex-grow text-left pointer-events-none">{name}</span>
            {shortcut && <span className="pl-6 text-right pointer-events-none">{shortcutSymbol}{shortcut}</span>}
        </button>
    )
}