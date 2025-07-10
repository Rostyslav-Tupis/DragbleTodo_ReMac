import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import Column from "./Column";
import { useTodo } from "@/store/TodoProvider";
import styles from "@/styles/board-styles.module.css";
import { CustomInput } from "./common/CInput";
import { CustomButton } from "./common/CButton";

const Board = () => {
  const {
    columns,
    moveTodo,
    reorderTodo,
    addColumn,
    setSearchTodo,
    searchTodo,
    reorderColumns,
    selectedTodos,
    completeSelectedTodos,
    incompleteSelectedTodos,
    moveSelectedTodos,
    deleteSelectedTodos,
    deselectAllTodos,
  } = useTodo();
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [moveToColumnId, setMoveToColumnId] = useState("");

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets.length;
        if (!destination) return;

        if (source.data.type === "todo") {
          const draggedTodoId = source.data.todoId;
          const sourceColumnRecord = location.initial.dropTargets[1];
          const sourceColumnId = sourceColumnRecord.data.columnId;
          const sourceColumn = columns.find((col) => col.id === sourceColumnId);
          const draggedTodoIndex = sourceColumn.todos.findIndex(
            (todo) => todo.id === draggedTodoId
          );

          if (destination === 1) {
            const [destinationColumnRecord] = location.current.dropTargets;
            const destinationColumnId = destinationColumnRecord.data.columnId;

            if (sourceColumnId === destinationColumnId) {
              const destinationIndex = getReorderDestinationIndex({
                startIndex: draggedTodoIndex,
                indexOfTarget: sourceColumn.todos.length - 1,
                closestEdgeOfTarget: null,
                axis: "vertical",
              });
              reorderTodo(sourceColumnId, draggedTodoIndex, destinationIndex);
            } else {
              moveTodo(draggedTodoId, sourceColumnId, destinationColumnId);
            }
          } else if (destination === 2) {
            const [destinationTodoRecord, destinationColumnRecord] =
              location.current.dropTargets;
            const destinationColumnId = destinationColumnRecord.data.columnId;
            const destinationColumn = columns.find(
              (col) => col.id === destinationColumnId
            );
            const indexOfTarget = destinationColumn.todos.findIndex(
              (todo) => todo.id === destinationTodoRecord.data.todoId
            );
            const closestEdgeOfTarget = extractClosestEdge(
              destinationTodoRecord.data
            );

            if (sourceColumnId === destinationColumnId) {
              const destinationIndex = getReorderDestinationIndex({
                startIndex: draggedTodoIndex,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              });
              reorderTodo(sourceColumnId, draggedTodoIndex, destinationIndex);
            } else {
              const destinationIndex =
                closestEdgeOfTarget === "bottom"
                  ? indexOfTarget + 1
                  : indexOfTarget;
              moveTodo(
                draggedTodoId,
                sourceColumnId,
                destinationColumnId,
                destinationIndex
              );
            }
          }
        } else if (source.data.type === "column") {
          const draggedColumnId = source.data.columnId;
          const sourceIndex = columns.findIndex(
            (col) => col.id === draggedColumnId
          );
          const [destinationColumnRecord] = location.current.dropTargets;
          const destinationColumnId = destinationColumnRecord.data.columnId;
          const destinationIndex = columns.findIndex(
            (col) => col.id === destinationColumnId
          );
          const closestEdgeOfTarget = extractClosestEdge(
            destinationColumnRecord.data
          );

          let newDestinationIndex = destinationIndex;
          if (
            closestEdgeOfTarget === "right" &&
            sourceIndex > destinationIndex
          ) {
            newDestinationIndex = destinationIndex + 1;
          } else if (
            closestEdgeOfTarget === "left" &&
            sourceIndex < destinationIndex
          ) {
            newDestinationIndex = destinationIndex - 1;
          }

          if (
            sourceIndex !== newDestinationIndex &&
            newDestinationIndex >= 0 &&
            newDestinationIndex < columns.length
          ) {
            reorderColumns(sourceIndex, newDestinationIndex);
          }
        }
      },
    });
  }, [columns, moveTodo, reorderTodo, reorderColumns]);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.controlButtons}>
          <div className={styles.createColumnField}>
            <CustomInput
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddColumn()}
              className={styles.input}
              placeholder="Add column"
            />
            <CustomButton onClick={handleAddColumn}>Add</CustomButton>
          </div>
          <CustomInput
            value={searchTodo}
            onChange={(e) => setSearchTodo(e.target.value)}
            className={styles.input}
            placeholder="Search by name"
          />
          {selectedTodos.length > 0 && (
            <div>
              <div className={styles.selectBox}>
                <select
                  value={moveToColumnId}
                  onChange={(e) => setMoveToColumnId(e.target.value)}
                  className={styles.input}
                >
                  <option value="" disabled>
                    Move to...
                  </option>
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
                <CustomButton
                  onClick={() =>
                    moveToColumnId && moveSelectedTodos(moveToColumnId)
                  }
                  disabled={!moveToColumnId}
                >
                  Move
                </CustomButton>
              </div>
              <div className={styles.optionalControlButtons}>
                <CustomButton
                  onClick={completeSelectedTodos}
                  className={`bg-green-500`}
                >
                  Mark as Completed
                </CustomButton>
                <CustomButton
                  onClick={incompleteSelectedTodos}
                  className={`bg-yellow-500`}
                >
                  Mark as Incomplete
                </CustomButton>
                <CustomButton
                  onClick={deleteSelectedTodos}
                  className={`bg-yellow-500`}
                >
                  Delete Selected
                </CustomButton>
                <CustomButton
                  onClick={deselectAllTodos}
                  className={`bg-yellow-500`}
                >
                  Deselect all
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.columnsWrapper}>
        {columns.map((column) => (
          <Column key={column.id} {...column} />
        ))}
      </div>
    </div>
  );
};

export default Board;
