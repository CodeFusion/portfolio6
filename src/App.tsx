import {MenuBar} from "./components/MenuBar";
import {Desktop} from "./components/Desktop";
import {ImagePreload} from "./components/ImagePreload/ImagePreload.tsx";

function App() {

  return (
    <div className="bg-black p-2 flex flex-col h-full z-auto" onContextMenu={(e) => {e.preventDefault(); return false}}>
      <div className="screen flex flex-col h-full ">
        <MenuBar />
        <Desktop />
      </div>
      <ImagePreload />
    </div>
  )
}

export default App
