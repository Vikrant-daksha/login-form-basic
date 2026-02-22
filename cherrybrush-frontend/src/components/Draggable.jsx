import { useDraggable } from "@dnd-kit/react";

export function Draggable({ file, id }) {

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={URL.createObjectURL(file)}
      style={style}
      className="w-24 h-24 object-cover cursor-move"
    />
  );
}