import {P7WindowProps} from "../components/P7Window";
import {create} from "zustand";
import defaultWindows from "./defaultWMState.json";
import {immer} from "zustand/middleware/immer";

type WMState = {
  windows: P7WindowProps[];
  topZIndex: number;
  focus: string | null;
}

type Actions = {
  addWindow: (win: P7WindowProps) => void;
  removeWindow: (id: string) => void;
  setWindows: (windows: P7WindowProps[]) => void;
  setWindow: (id: string, window: P7WindowProps) => void;
  incrementZIndex: () => void;
  setFocus: (id: string | null) => void;
}

export const useWindowManager = create<WMState & Actions>()(
  immer((set) => ({
    windows: defaultWindows.windows,
    topZIndex: 10000,
    focus: defaultWindows.windows[defaultWindows.windows.length-1].id,
    addWindow: (win) =>
      set((state) => {
        state.topZIndex += 1
        state.focus = win.id
        state.windows.push(win)
      }),
    removeWindow: (id) =>
      set((state) => {
        state.windows = state.windows.filter((win) => win.id !== id)
        if (state.windows.length > 0) {
          state.focus = state.windows[state.windows.length - 1].id
        }
      }),
    setWindows: (windows) => set(() => ({windows})),
    setWindow: (id, window) =>
      set((state) => {
        const index = state.windows.findIndex((_win) => _win.id === id)
        if (index !== -1) {
          state.windows[index] = window
        } else {
          state.windows.push(window)
        }
      }),
    incrementZIndex: () => set((state) => {
      state.topZIndex += 1
    }),
    setFocus: (id: string | null) => set((state) => {
      state.topZIndex += 1
      state.focus = id
    })
})))
