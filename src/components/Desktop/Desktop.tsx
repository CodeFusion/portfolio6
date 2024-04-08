import './Desktop.css';
import {P7File, P7FileProps} from "../P7File";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {useEffect, useRef, useState} from "react";
import {P7Window, P7WindowProps} from "../P7Window";
import {P7WindowShell, P7WindowShellProps} from "../P7Window/P7WindowShell.tsx";
import {useWindowManager} from "../../state/windowManager.ts";
import {useShallow} from "zustand/react/shallow";
import {useFileSystem} from "../../state/fileSystem.ts";
import {Phoenix} from "../Applications/Phoenix/Phoenix.tsx";
import {deepCopy, getParentWithClass, isWithinHighlight} from "../../utils";
import {Yuki} from "../Applications/Yuki/Yuki.tsx";
import {HighlightProps} from "../../models";
import {About} from "../Applications/About/About.tsx";
import {TextViewer} from "../Applications/TextViewer/TextViewer.tsx";

export const Desktop = () => {
    const [activeItem, setActiveItem] = useState<P7FileProps[]|P7WindowProps|null>(null)
    const [activeWinProps, setActiveWinProps] = useState<P7WindowShellProps|null>(null);
    const highlightRef = useRef<HighlightProps | null>(null)
    const [highlight, setHighlight] = useState<HighlightProps | null>(null)
    const desktopRef = useRef<HTMLDivElement | null>(null)

    const {windows, setWindow, setWindowFocus} = useWindowManager(
      useShallow((state) => ({
          windows: state.windows, setWindow: state.setWindow, setWindowFocus: state.setFocus
      }))
    );

    const {files, setFile, focusedFiles, setFileFocus} = useFileSystem(
      useShallow((state) => ({
          files: state.files['desktop'].files, setFile: state.setFile, focusedFiles: state.focus, setFileFocus: state.setFocus
      }))
    );

    const { setNodeRef } = useDroppable({
        id: 'desktop'
    })

    const setRef = (elem: HTMLDivElement | null) => {
        setNodeRef(elem)
        desktopRef.current = elem
    };

    const sensors = useSensors(
      useSensor(PointerSensor, {
          activationConstraint: {
              delay: 100,
              distance: 0
          }
      })
    )

    useEffect(() => {
        const handleResize = () => {
            files.forEach((file) => {
                const fileRect = document.getElementById(file.id)?.getBoundingClientRect();
                const desktopRect = desktopRef.current?.getBoundingClientRect();
                const newFile = deepCopy(file);
                if (!fileRect || !desktopRect || !newFile) return;

                let changed = false;

                if (fileRect.right > desktopRect.right) {
                    newFile.position.x = -20
                    changed = true;
                }

                if (fileRect.bottom > desktopRect.bottom) {
                    //newFile.position.y = desktopRect.bottom - fileRect.height - 20
                    changed = true;
                }

                if (changed) {
                    setFile('desktop', file.id, newFile)
                }

            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [files, setFile]);

    const handleDragStart = (e: DragStartEvent) => {
        if (e.active.id.toString().startsWith('f-')) {
            const clickedFile = files.find((file) => file.id === e.active.id)
            setActiveItem(files.filter((file) => focusedFiles.includes(file.id))
              .map((file) => {
                  return {
                      ...file,
                      position: {
                          x: file.position.x - clickedFile!.position.x,
                          y: file.position.y - clickedFile!.position.y
                      }
                  }
              })
            )
        } else if (e.active.id.toString().startsWith('w-')) {
            setActiveItem(windows.find((win) => win.id === e.active.id) ?? null)
            setActiveWinProps({height: e.active.data.current?.winRef.clientHeight ?? 0, width: e.active.data.current?.winRef.clientWidth ?? 0})
        }
    }

    const handleDragEnd = (e: DragEndEvent) => {
        if (e.active.id.toString().startsWith('f-')) {
            const updatedFiles = []
            for (const item of activeItem as P7FileProps[]) {
                const file = deepCopy(files.find((curr) => curr.id == item.id));
                const fileRect = document.getElementById(file?.id ?? '')?.getBoundingClientRect();
                if (!file || !fileRect) return;

                if (file.position.x < 0) {
                    file.position.x = fileRect.x - (desktopRef.current?.getBoundingClientRect().x ?? 0)
                }

                file.position.x += e.delta.x;
                file.position.y += e.delta.y;

                if (!fileRect || file.position.x < 0 || file.position.y < 0 ||
                  file.position.x + fileRect.height > window.innerWidth ||
                  file.position.y + fileRect.width > window.innerHeight) {
                    return;
                }
                updatedFiles.push(file)
            }
            for (const file of updatedFiles) {
                setFile('desktop', file.id, file)
            }
        } else if (e.active.id.toString().startsWith('w-')) {
            const win = deepCopy(windows.find((win) => win.id === e.active.id))
            if (win == undefined) return;

            win.position.x += e.delta.x;
            win.position.y += e.delta.y;

            setWindow(win.id, win)
        }

        setActiveItem(null)
        setActiveWinProps(null)
    }

    const handleMouseUp = () => {
        highlightRef.current = null;
        setHighlight(null)
        document.removeEventListener('mousemove', handleMouseMove)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (highlightRef.current) {
            highlightRef.current = {
                ...highlightRef.current,
                x: Math.min(e.clientX, highlightRef.current.initX),
                y: Math.min(e.clientY, highlightRef.current.initY),
                width: Math.abs(e.clientX - (highlightRef.current.initX)),
                height: Math.abs(e.clientY - (highlightRef.current.initY))
            }
            setHighlight(highlightRef.current)

            const highlighted: string[] = []

            desktopRef.current?.childNodes.forEach((child) => {
                if ((child as HTMLElement).classList.contains('p7file') &&
                  isWithinHighlight((child as HTMLElement), highlightRef.current!)) {
                    highlighted.push((child as HTMLElement).id)
                }
            })

            setFileFocus(highlighted)
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            highlightRef.current = {
                initX: e.clientX,
                initY: e.clientY,
                x: e.clientX,
                y: e.clientY,
                width: 0,
                height: 0
            }

            document.addEventListener('mouseup', handleMouseUp, {once: true})
            document.addEventListener('mousemove', handleMouseMove)
        }

        if (!getParentWithClass(e.target as HTMLElement, 'p7window')) {
            setWindowFocus(null)
        }

        if (!getParentWithClass(e.target as HTMLElement, 'p7file')) {
            setFileFocus([])
        }

        const fileElem = getParentWithClass(e.target as HTMLElement, 'p7file')
        if (fileElem && !(focusedFiles.includes(fileElem.id))) {
            if (e.shiftKey) {
                setFileFocus([...focusedFiles, fileElem.id])
            } else {
                setFileFocus([fileElem.id])
            }
        }
    }

    return (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
            >
            <div
                className="halftone-bg flex-grow w-full rounded-b-xl relative overflow-hidden"
                ref={setRef}
                tabIndex={0}
                onMouseDown={handleMouseDown}
            >
                {files.map((fileProps) => (
                    <P7File {...fileProps} key={fileProps.id}/>
                ))}
                {windows.map((windowProps) => (
                    <P7Window
                      {...windowProps}
                      key={windowProps.id}
                    >
                        {windowProps.appData?.app === 'phoenix' &&
                            <Phoenix path={windowProps.appData?.path}/>
                        }
                        {windowProps.appData?.app === 'yuki' &&
                            <Yuki url={windowProps.appData?.path} />
                        }
                        {windowProps.appData?.app === 'about' &&
                            <About />
                        }
                        {windowProps.appData?.app === 'text' &&
                            <TextViewer filename={windowProps.appData?.path} />
                        }
                    </P7Window>
                ))}
                {highlight && (
                  <div
                    style={{
                        position: 'absolute',
                        left: `${highlight.x - desktopRef.current!.getBoundingClientRect().left}px`,
                        top: `${highlight.y - desktopRef.current!.getBoundingClientRect().top}px`,
                        width: `${highlight.width}px`,
                        height: `${highlight.height}px`,
                        border: '2px dotted #000',
                    }}
                  />
                )}
            </div>
            <DragOverlay zIndex={999999}>
                {activeItem instanceof Array &&
                  activeItem.map((item) => (
                    <P7File {...item} key={item.id} overlay={true} />
                  ))
                }
                {activeItem !== null && !(activeItem instanceof Array) && activeItem?.id.toString().startsWith('w-') &&
                  <P7WindowShell width={activeWinProps?.width ?? 0} height={activeWinProps?.height ?? 0}/>
                }
            </DragOverlay>
        </DndContext>
    )
}
