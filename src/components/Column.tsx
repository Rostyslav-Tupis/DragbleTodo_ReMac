import { useEffect, useRef, useState, type FC } from "react";
import Card from "./Card";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useTodo } from "@/store/TodoProvider";
import styles from "@/styles/column.module.css";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { CustomInput } from "./common/CInput";
import DropIndicator from "./DropIndicator";
import type { ColumnType } from "@/types/todo-type";

interface ColumnProps {
  id: ColumnType["id"];
  title: ColumnType["title"];
  todos: ColumnType["todos"];
}

const Column: FC<ColumnProps> = ({ id, title, todos }) => {
  const columnRef = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const {
    deleteColumn,
    addTodo,
    selectAllTodosInColumn,
    deselectAllTodosInColumn,
  } = useTodo();

  useEffect(() => {
    const columnEl = columnRef.current;
    if (!columnEl) return;

    return combine(
      draggable({
        element: columnEl,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
        getInitialData: () => ({ type: "column", columnId: id }),
      }),
      dropTargetForElements({
        element: columnEl,
        getData: ({ input, element }) => {
          return attachClosestEdge(
            { type: "column", columnId: id },
            {
              input,
              element,
              allowedEdges: ["left", "right"],
            }
          );
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          if (
            args.source.data.type === "column" &&
            args.source.data.columnId !== id
          ) {
            setIsDraggedOver(true);
            setClosestEdge(extractClosestEdge(args.self.data));
          } else if (args.self.data.type === "todo-drop") {
            setIsDraggedOver(true);
          }
        },
        onDrag: (args) => {
          if (
            args.source.data.type === "column" &&
            args.source.data.columnId !== id
          ) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setIsDraggedOver(false);
          setClosestEdge(null);
        },
        onDrop: () => {
          setIsDraggedOver(false);
          setClosestEdge(null);
        },
      })
    );
  }, [id]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo, id);
      setNewTodo("");
    }
  };

  return (
    <div
      ref={columnRef}
      className={`${styles.column} ${isDragging ? styles.dragging : ""} ${
        isDraggedOver ? styles.draggedOver : ""
      }`}
      style={{ position: "relative" }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.headerButtons}>
          {todos.length > 0 && (
            <>
              <button
                onClick={() => selectAllTodosInColumn(id)}
                className={styles.selectButton}
              >
                Select All
              </button>
              <button
                onClick={() => deselectAllTodosInColumn(id)}
                className={styles.selectButton}
              >
                Deselect All
              </button>
            </>
          )}
          <button
            onClick={() => deleteColumn(id)}
            className={styles.deleteButton}
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.inputWrapper}>
        <CustomInput
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
          className={styles.input}
          placeholder="Add task"
        />
        <button onClick={() => handleAddTodo()} className={styles.addButton}>
          Add task
        </button>
      </div>

      {todos?.map((todo) => (
        <Card key={todo.id} {...todo} columnId={id} />
      ))}
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
    </div>
  );
};

export default Column;
