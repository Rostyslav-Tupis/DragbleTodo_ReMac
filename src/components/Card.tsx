import { useEffect, useRef, useState, type FC } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useTodo } from "@/store/TodoProvider";
import type { ColumnType, TodoType } from "@/types/todo-type";
import styles from "@/styles/card.module.css";
import { Pencil, Trash } from "lucide-react";
import DropIndicator from "./DropIndicator";
import { CustomInput } from "./common/CInput";

interface CardProps {
  id: TodoType["id"];
  description: TodoType["description"];
  isCompleted: TodoType["isCompleted"];
  columnId: ColumnType["id"];
}

const Card: FC<CardProps> = ({ id, description, isCompleted, columnId }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [closestEdge, setClosestEdge] = useState<null | "top" | "bottom">(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(description);
  const {
    completeTodo,
    removeTodo,
    toggleSelectTodo,
    selectedTodos,
    editTodo,
  } = useTodo();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isSelected = selectedTodos.some(
    (todo) => todo.id === id && todo.columnId === columnId
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return combine(
      draggable({
        element: el,
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
        getInitialData: () => ({ type: "todo", todoId: id }),
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          const data = { type: "todo", todoId: id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          if (args.source.data.todoId !== id) {
            setIsDraggedOver(true);
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.todoId !== id) {
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

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(description);
  };

  const handleEditText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleOnBlurEdit = () => {
    if (editText.trim()) {
      editTodo(id, columnId, editText);
    } else {
      setEditText(description);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (editText.trim()) {
        editTodo(id, columnId, editText);
      } else {
        setEditText(description);
      }
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={ref}
      className={`${styles.card} ${dragging ? styles.dragging : ""} ${
        isCompleted ? styles.completed : ""
      } ${isDraggedOver ? styles.draggedOver : ""} ${
        isSelected ? styles.selected : ""
      }`}
    >
      <div className={styles.descriptionBox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            toggleSelectTodo(id, columnId);
          }}
          className={styles.checkbox}
        />

        <div className={styles.editContainer}>
          {isEditing ? (
            <CustomInput
              value={editText}
              onChange={handleEditText}
              onBlur={handleOnBlurEdit}
              onKeyDown={handleKeyDown}
              className={styles.editInput}
              ref={inputRef}
            />
          ) : (
            <p
              onClick={() => completeTodo(id, columnId)}
              className={styles.descriptionText}
            >
              {description}
            </p>
          )}
          <Pencil onClick={handleEdit} className={styles.editButton} />
        </div>

        <Trash
          className={styles.deleteIcon}
          onClick={(e) => {
            e.stopPropagation();
            removeTodo(id, columnId);
          }}
        />
      </div>
      {closestEdge && <DropIndicator edge={closestEdge} gap="5px" />}
    </div>
  );
};

export default Card;
