import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ---------- SINGLE IMAGE ITEM ----------
function SortableItem({ file, id, remove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative"
    >
      <img
        id={id}
        {...listeners}
        src={URL.createObjectURL(file)}
        className="w-24 h-24 object-cover rounded-lg cursor-move"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          remove(id);
        }}
        className="absolute -top-1.5 -right-1.5 text-xl bg-white rounded-full cursor-pointer"
      >
        <IoIosCloseCircle />
      </button>
    </div>
  );
}

// ---------- MAIN UPLOADER ----------
export default function SortableUploader({ files, setFiles }) {
  // DROP FILES
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = [...e.dataTransfer.files];

    const mapped = dropped.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  // DRAG END → reorder array
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);

      setFiles(arrayMove(files, oldIndex, newIndex));
    }
  };

  // DELETE IMAGE
  const remove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div>
      {/* DROP AREA */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed p-10 mb-5 text-center rounded-2xl text-gray-400"
      >
        Drag images here
      </div>

      {/* SORTABLE GRID */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={files.map((f) => f.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex gap-3 flex-wrap">
            {files.map((f) => (
              <SortableItem
                key={f.id}
                id={f.id}
                file={f.file}
                remove={remove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
