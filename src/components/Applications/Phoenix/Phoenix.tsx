import {useFileSystem} from "../../../state/fileSystem.ts";
import {useShallow} from "zustand/react/shallow";
import {
  DndContext, DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {restrictToParentElement} from "@dnd-kit/modifiers";
import {P7File, P7FileProps} from "../../P7File";
import {useRef, useState} from "react";
import {HighlightProps} from "../../../models";
import {deepCopy, getParentWithClass, isWithinHighlight} from "../../../utils";

export type PhoenixProps = {
  path: string,
}

export const Phoenix = ({path}: PhoenixProps) => {
  const phoenixRef = useRef<HTMLDivElement | null>(null)
  const [activeItems, setActiveItems] = useState<P7FileProps[]>([])
  const highlightRef = useRef<HighlightProps | null>(null)
  const [highlight, setHighlight] = useState<HighlightProps | null>(null)

  const {files, setFile, focus, setFocus} = useFileSystem(
    useShallow((state) => (
      {files: state.files[path].files, setFile: state.setFile, focus: state.focus, setFocus: state.setFocus}
    ))
  );

  const {setNodeRef} = useDroppable({
    id: path
  })

  const setRef = (elem: HTMLDivElement | null) => {
    setNodeRef(elem)
    phoenixRef.current = elem
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        distance: 0
      }
    })
  )

  const handleDragStart = (e: DragStartEvent) => {
    const clickedFile = files.find((file) => file.id === e.active.id)
    setActiveItems(files.filter((file) => focus.includes(file.id))
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
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const updatedFiles = []
    for (const item of activeItems as P7FileProps[]) {
      const file = deepCopy(files.find((curr) => curr.id == item.id));
      if (!file) return;

      file.position.x += e.delta.x;
      file.position.y += e.delta.y;

      const fileRect = document.getElementById(file.id)?.getBoundingClientRect();

      if (!fileRect || file.position.x < 0 || file.position.y < 0 ||
        file.position.x + fileRect.height > window.innerWidth ||
        file.position.y + fileRect.width > window.innerHeight) {
        return;
      }
      updatedFiles.push(file)
    }
    for (const file of updatedFiles) {
      setFile(path, file.id, file)
    }
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

      phoenixRef.current?.childNodes.forEach((child) => {
        if ((child as HTMLElement).classList.contains('p7file') &&
          isWithinHighlight((child as HTMLElement), highlightRef.current!)) {
          highlighted.push((child as HTMLElement).id)
        }
      })

      setFocus(highlighted)
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

    if (!getParentWithClass(e.target as HTMLElement, 'p7file')) {
      setFocus([])
    }

    const fileElem = getParentWithClass(e.target as HTMLElement, 'p7file')
    if (fileElem && !(focus.includes(fileElem.id))) {
      if (e.shiftKey) {
        setFocus([...focus, fileElem.id])
      } else {
        setFocus([fileElem.id])
      }
    }
  }

  return (

    <div
      style={{inset: 0, position: 'absolute'}}
      className={"bg-white"}
      ref={setRef}
      onMouseDown={handleMouseDown}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        sensors={sensors}
      >
        {files.map((fileProps) => (
          <P7File {...fileProps} key={fileProps.id}/>
        ))}
        {highlight && (
          <div
            style={{
              position: 'absolute',
              left: `${highlight.x - phoenixRef.current!.getBoundingClientRect().left}px`,
              top: `${highlight.y - phoenixRef.current!.getBoundingClientRect().top}px`,
              width: `${highlight.width}px`,
              height: `${highlight.height}px`,
              border: '2px dotted #000',
            }}
          />
        )}
        <DragOverlay>
          {activeItems.map((activeItem) =>
            <P7File {...activeItem} overlay={true}/>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
