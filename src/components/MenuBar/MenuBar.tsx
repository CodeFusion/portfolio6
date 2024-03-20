import {Menu} from "./Menu.tsx";
import {MenuItemProps} from "./MenuItem.tsx";
import React from "react";

export const MenuBar = () => {

    const fileMenuItems: MenuItemProps = [
        {name: "Open", disabled: false, shortcut: "O"},
        {name: "Print", disabled: true},
        {name: "Close", disabled: true, shortcut: "W"}
    ];

    const editMenuItems: MenuItemProps = [
        {name: "Cut", disabled: true, shortcut: "X"},
        {name: "Copy", disabled: true, shortcut: "C"},
        {name: "Paste", disabled: true, shortcut: "V"},
        {name: "Clear", disabled: true},
        {name: "Select All", disabled: true, shortcut: "A"}
    ];

    const viewMenuItems: MenuItemProps = [
        {name: "by Small Icon", disabled: true},
        {name: "by Icon", disabled: true},
        {name: "by Name", disabled: true},
        {name: "by Date", disabled: true},
        {name: "by Size", disabled: true},
        {name: "by Kind", disabled: true}
    ];

    const specialMenuItems: MenuItemProps = [
        {name: "Restart", disabled: false},
        {name: "Shut Down", disabled: false}
    ];

    return (
        <div className="flex w-full border-b-2 border-black px-8 bg-white">
            <Menu name="File" items={fileMenuItems} />
            <Menu name="Edit" items={editMenuItems} />
            <Menu name="View" items={viewMenuItems} />
            <Menu name="Special" items={specialMenuItems} />
        </div>
    )
}