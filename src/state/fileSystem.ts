import {P7FileProps} from "../components/P7File";
import {create} from "zustand";
import * as defaultFiles from "./defaultFSState.json";
import {immer} from "zustand/middleware/immer";

type FSState = {
  files: FileSystem;
}

type Actions = {
  addFile: (path: string, file: P7FileProps) => void;
  removeFile: (path: string, id: string) => void;
  setFile: (path: string, id: string, file: P7FileProps) => void
}

type FileSystem = Record<string, {name: string, files: P7FileProps[]}>

export const useFileSystem = create<FSState & Actions>()(
  immer((set) => ({
    files: defaultFiles as FileSystem,
    addFile: (path, file) =>
      set((state) => {
        state.files[path].files.push(file)
      }),
    removeFile: (path, id) =>
      set((state) => {
        state.files[path].files = state.files[path].files.filter((file) => file.id !== id)
      }),
    setFile: (path, id, file) => {
      set((state) => {
        const index = state.files[path].files.findIndex((_file) => _file.id === id)
        if (index !== -1) {
          state.files[path].files[index] = file
        } else {
          state.files[path].files.push(file)
        }
      })
    }
  }))
)
