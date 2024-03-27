import {useWindowManager} from "../state/windowManager.ts";

export const createPhoenixWindow = (name: string, path: string) => {
  const windows = useWindowManager.getState().windows
  const match = windows.findIndex((_win) => _win.appData?.path === path)
  if (match === -1) {
    const id = `w-${path}`;
    useWindowManager.getState().addWindow({
        id,
        title: name,
        position: {
          x: 20,
          y: 20
        },
        appData: {
          app: 'phoenix',
          path: path
        }
      }
    )
  }
  // TODO: Bring to front
}

export const createYukiWindow = (url: string) => {
  const index = useWindowManager.getState().windows.findIndex((_win) => _win.id === 'w-yuki')
  if (index === -1) {
    useWindowManager.getState().addWindow({
      id: 'w-yuki',
      title: 'Yuki Browser',
      position: {
        x: 10,
        y: 10
      },
      appData: {
        app: 'yuki',
        path: url
      }
    })
  }
}
