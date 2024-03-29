import './Desktop.css';
import {P7File, P7FileProps} from "../P7File";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent, PointerSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {restrictToParentElement} from '@dnd-kit/modifiers';
import {useState} from "react";
import {P7Window, P7WindowProps} from "../P7Window";
import {P7WindowShell, P7WindowShellProps} from "../P7Window/P7WindowShell.tsx";
import {useWindowManager} from "../../state/windowManager.ts";
import {useShallow} from "zustand/react/shallow";
import {useFileSystem} from "../../state/fileSystem.ts";
import {Phoenix} from "../Applications/Phoenix/Phoenix.tsx";
import {deepCopy} from "../../utils";
import {Yuki} from "../Applications/Yuki/Yuki.tsx";

export const Desktop = () => {
    const [activeItem, setActiveItem] = useState<P7FileProps|P7WindowProps|null>(null)
    const [activeWinProps, setActiveWinProps] = useState<P7WindowShellProps|null>(null);

    const {windows, setWindow} = useWindowManager(
      useShallow((state) => ({windows: state.windows, setWindow: state.setWindow}))
    );

    const {files, setFile} = useFileSystem(
      useShallow((state) => ({files: state.files['desktop'].files, setFile: state.setFile}))
    );

    const { setNodeRef } = useDroppable({
        id: 'desktop'
    })

    const sensors = useSensors(
      useSensor(PointerSensor, {
          activationConstraint: {
              delay: 100,
              distance: 0
          }
      })
    )

    const handleDragStart = (e: DragStartEvent) => {
        if (e.active.id.toString().startsWith('f-')) {
            setActiveItem(files.find((file) => file.id === e.active.id) ?? null)
        } else if (e.active.id.toString().startsWith('w-')) {
            setActiveItem(windows.find((win) => win.id === e.active.id) ?? null)
            setActiveWinProps({height: e.active.data.current?.winRef.current.offsetHeight ?? 0, width: e.active.data.current?.winRef.current.offsetWidth ?? 0})
        }
    }

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveItem(null)
        setActiveWinProps(null)
        if (e.active.id.toString().startsWith('f-')) {
            const file = deepCopy(files.find((curr) => curr.id == e.active.id));
            if (!file) return;

            file.position.x += e.delta.x;
            file.position.y += e.delta.y;

            setFile('desktop', file.id, file)
        } else if (e.active.id.toString().startsWith('w-')) {
            const win = deepCopy(windows.find((win) => win.id === e.active.id))
            if (win == undefined) return;

            win.position.x += e.delta.x;
            win.position.y += e.delta.y;

            setWindow(win.id, win)
        }
    }

    return (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
          sensors={sensors}
            >
            <div
                className="halftone-bg flex-grow w-full rounded-b-xl relative"
                ref={setNodeRef}
            >
                {files.map((fileProps) => (
                    <P7File {...fileProps} key={fileProps.id}/>
                ))}
                {windows.map((windowProps) => (
                    <P7Window {...windowProps} key={windowProps.id}>
                        {windowProps.appData?.app === 'phoenix' &&
                            <Phoenix path={windowProps.appData?.path}/>
                        }
                        {windowProps.appData?.app === 'yuki' &&
                            <Yuki url={windowProps.appData?.path} />
                        }
                    </P7Window>
                ))}
            </div>
            <DragOverlay style={{zIndex: 800000}}>
                {activeItem?.id.toString().startsWith('f-') &&
                  <P7File {...activeItem as P7FileProps} position={{x: 0, y:0}} overlay={true} />
                }
                {activeItem?.id.toString().startsWith('w-') &&
                  <P7WindowShell width={activeWinProps?.width ?? 0} height={activeWinProps?.height ?? 0}/>
                }
            </DragOverlay>
        </DndContext>
    )
}
