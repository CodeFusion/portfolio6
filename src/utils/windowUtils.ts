import {useWindowManager} from "../state/windowManager.ts";

export const createPhoenixWindow = (name: string, path: string) => {
  const windows = useWindowManager.getState().windows
  const setFocus = useWindowManager.getState().setFocus
  const match = windows.findIndex((_win) => _win.appData?.path === path)
  if (match === -1) {
    const id = `w-${path}`;
    useWindowManager.getState().addWindow({
        id,
        title: name,
        scrollable: true,
        position: {
          x: 20,
          y: 20
        },
        size: {
          width: 400,
          height: 300
        },
        appData: {
          app: 'phoenix',
          path: path
        }
      }
    )
  } else {
    setFocus(`w-${path}`)
  }
}

export const createYukiWindow = (url: string) => {
  const setFocus = useWindowManager.getState().setFocus
  const index = useWindowManager.getState().windows.findIndex((_win) => _win.id === 'w-yuki')
  if (index === -1) {
    useWindowManager.getState().addWindow({
      id: 'w-yuki',
      title: 'Yuki Browser',
      scrollable: true,
      position: {
        x: 10,
        y: 10
      },
      size: {
        width: 400,
        height: 300
      },
      appData: {
        app: 'yuki',
        path: url
      }
    })
  } else {
    setFocus(`w-yuki`)
  }
}

export const createAboutWindow = () => {
  const setFocus = useWindowManager.getState().setFocus
  const index = useWindowManager.getState().windows.findIndex((_win) => _win.id === 'w-about')
  if (index === -1) {
    useWindowManager.getState().addWindow({
      id: 'w-about',
      title: 'About This Portfolio',
      scrollable: false,
      position: {
        x: 150,
        y: 150
      },
      size: {
        width: 360,
        height: 165
      },
      appData: {
        app: 'about',
      }
    })
  } else {
    setFocus(`w-about`)
  }
}

export const createTextViewerWindow = (filename: string) => {
  const setFocus = useWindowManager.getState().setFocus
  const index = useWindowManager.getState().windows.findIndex((_win) => _win.id === `w-${filename}`)
  if (index === -1) {
    useWindowManager.getState().addWindow({
      id: `w-${filename}`,
      title: filename,
      scrollable: true,
      position: {
        x: 30,
        y: 30
      },
      size: {
        width: 600,
        height: 700
      },
      appData: {
        app: 'text',
        path: filename
      }
    })
  } else {
    setFocus(`w-${filename}`)
  }
}
