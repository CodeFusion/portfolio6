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
import {useState} from "react";

export type PhoenixProps = {
  path: string,
}

export const Phoenix = ({path}: PhoenixProps) => {
  const [activeItem, setActiveItem] = useState<P7FileProps|null>(null)

  const {files, setFile} = useFileSystem(
    useShallow((state) => ({files: state.files[path].files, setFile: state.setFile}))
  );

  const { setNodeRef } = useDroppable({
    id: path
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
    setActiveItem(files.find((file) => file.id === e.active.id) ?? null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveItem(null)
    const file: P7FileProps = JSON.parse(JSON.stringify(files.find((_file) => _file.id == e.active.id) ?? null));
    if (!file) return;

    file.position.x += e.delta.x;
    file.position.y += e.delta.y;

    setFile(path, file.id, file)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
      sensors={sensors}
      >
      <div style={{width: '400px', height: '300px', position: 'relative'}} ref={setNodeRef}>
        {files.map((fileProps) => (
          <P7File {...fileProps} key={fileProps.id}/>
        ))}
      </div>
      <DragOverlay>
          {activeItem &&
            <P7File {...activeItem} overlay={true} />
          }
      </DragOverlay>
    </DndContext>
  )
}
