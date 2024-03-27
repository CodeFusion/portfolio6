import {MenuBar} from "./components/MenuBar";
import {Desktop} from "./components/Desktop";

function App() {

  return (
    <div className="bg-black flex flex-col h-full p-2 z-auto" onContextMenu={(e) => {e.preventDefault(); return false}}>
        <MenuBar />
        <Desktop />
    </div>
  )
}

export default App
