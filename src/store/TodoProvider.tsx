import type { ColumnType, TodoType } from "@/types/todo-type";
import { nanoid } from "nanoid";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { TodoContextType } from "./TodoContext-type";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: FC<TodoProviderProps> = ({ children }) => {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    try {
      const stored = localStorage.getItem("columns");
      return stored
        ? JSON.parse(stored)
        : [
            { id: nanoid(), title: "To Do", todos: [] },
            { id: nanoid(), title: "In Progress", todos: [] },
            { id: nanoid(), title: "Done", todos: [] },
          ];
    } catch (error) {
      return [
        { id: nanoid(), title: "To Do", todos: [] },
        { id: nanoid(), title: "In Progress", todos: [] },
        { id: nanoid(), title: "Done", todos: [] },
      ];
    }
  });
  const [filterComplete, setFilterComplete] = useState(false);
  const [searchTodo, setSearchTodo] = useState("");
  const [selectedTodos, setSelectedTodos] = useState<
    { id: string; columnId: string }[]
  >([]);

  const addColumn = (title: string) => {
    const newColumn = { id: nanoid(), title, todos: [] };
    setColumns((prev) => [...prev, newColumn]);
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
    setSelectedTodos((prev) => prev.filter((todo) => todo.columnId !== id));
  };

  const addTodo = (description: string, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              todos: [
                { id: nanoid(), description, isCompleted: false },
                ...col.todos,
              ],
            }
          : col
      )
    );
  };

  const completeTodo = (todoId: string, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              todos: col.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, isCompleted: !todo.isCompleted }
                  : todo
              ),
            }
          : col
      )
    );
  };

  const removeTodo = (todoId: string, columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, todos: col.todos.filter((todo) => todo.id !== todoId) }
          : col
      )
    );
    setSelectedTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  const moveTodo = (
    todoId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    index?: number
  ) => {
    setColumns((prev) => {
      const sourceColumn = prev.find((col) => col.id === sourceColumnId);
      const destinationColumn = prev.find(
        (col) => col.id === destinationColumnId
      );
      if (!sourceColumn || !destinationColumn) return prev;

      const todo = sourceColumn.todos.find((t) => t.id === todoId);
      if (!todo) return prev;

      const updatedSourceTodos = sourceColumn.todos.filter(
        (t) => t.id !== todoId
      );
      const updatedDestinationTodos = [...destinationColumn.todos];
      if (index !== undefined) {
        updatedDestinationTodos.splice(index, 0, todo);
      } else {
        updatedDestinationTodos.push(todo);
      }

      return prev.map((col) =>
        col.id === sourceColumnId
          ? { ...col, todos: updatedSourceTodos }
          : col.id === destinationColumnId
          ? { ...col, todos: updatedDestinationTodos }
          : col
      );
    });
    setSelectedTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId && todo.columnId === sourceColumnId
          ? { ...todo, columnId: destinationColumnId }
          : todo
      )
    );
  };

  const reorderTodo = (
    columnId: string,
    startIndex: number,
    finishIndex: number
  ) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              todos: reorder(col.todos, startIndex, finishIndex),
            }
          : col
      )
    );
  };

  const reorderColumns = (startIndex: number, finishIndex: number) => {
    setColumns((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(finishIndex, 0, removed);
      return result;
    });
    setSelectedTodos((prev) =>
      prev.map((todo) => {
        const oldColumnId = columns[startIndex].id;
        const newColumnId = columns[finishIndex].id;
        return todo.columnId === oldColumnId
          ? { ...todo, columnId: newColumnId }
          : todo.columnId === newColumnId
          ? { ...todo, columnId: oldColumnId }
          : todo;
      })
    );
  };

  const reorder = (
    list: TodoType[],
    startIndex: number,
    finishIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(finishIndex, 0, removed);
    return result;
  };

  const toggleFilter = () => setFilterComplete((prev) => !prev);

  const toggleSelectTodo = (todoId: string, columnId: string) => {
    setSelectedTodos((prev) => {
      const isSelected = prev.some(
        (todo) => todo.id === todoId && todo.columnId === columnId
      );
      if (isSelected) {
        return prev.filter(
          (todo) => !(todo.id === todoId && todo.columnId === columnId)
        );
      }
      return [...prev, { id: todoId, columnId }];
    });
  };

  const selectAllTodosInColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;
    const todosToSelect = column.todos
      .filter((todo) =>
        todo.description.toLowerCase().includes(searchTodo.toLowerCase())
      )
      .filter((todo) => (filterComplete ? todo.isCompleted : true))
      .map((todo) => ({ id: todo.id, columnId }));
    setSelectedTodos((prev) => [
      ...prev.filter((todo) => todo.columnId !== columnId),
      ...todosToSelect,
    ]);
  };

  const deselectAllTodosInColumn = (columnId: string) => {
    setSelectedTodos((prev) =>
      prev.filter((todo) => todo.columnId !== columnId)
    );
  };

  const selectAllTodos = () => {
    const allTodos = columns.flatMap((col) =>
      col.todos
        .filter((todo) =>
          todo.description.toLowerCase().includes(searchTodo.toLowerCase())
        )
        .filter((todo) => (filterComplete ? todo.isCompleted : true))
        .map((todo) => ({ id: todo.id, columnId: col.id }))
    );
    setSelectedTodos(allTodos);
  };

  const deselectAllTodos = () => {
    setSelectedTodos([]);
  };

  const deleteSelectedTodos = () => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        todos: col.todos.filter(
          (todo) =>
            !selectedTodos.some(
              (selected) =>
                selected.id === todo.id && selected.columnId === col.id
            )
        ),
      }))
    );
    setSelectedTodos([]);
  };

  const completeSelectedTodos = () => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        todos: col.todos.map((todo) =>
          selectedTodos.some(
            (selected) =>
              selected.id === todo.id && selected.columnId === col.id
          )
            ? { ...todo, isCompleted: true }
            : todo
        ),
      }))
    );
  };

  const incompleteSelectedTodos = () => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        todos: col.todos.map((todo) =>
          selectedTodos.some(
            (selected) =>
              selected.id === todo.id && selected.columnId === col.id
          )
            ? { ...todo, isCompleted: false }
            : todo
        ),
      }))
    );
  };

  const moveSelectedTodos = (destinationColumnId: string) => {
    setColumns((prev) => {
      let updatedColumns = prev;
      selectedTodos.forEach((selected) => {
        const sourceColumn = updatedColumns.find(
          (col) => col.id === selected.columnId
        );
        const destinationColumn = updatedColumns.find(
          (col) => col.id === destinationColumnId
        );
        if (
          !sourceColumn ||
          !destinationColumn ||
          sourceColumn.id === destinationColumnId
        )
          return;

        const todo = sourceColumn.todos.find((t) => t.id === selected.id);
        if (!todo) return;

        updatedColumns = updatedColumns.map((col) =>
          col.id === selected.columnId
            ? { ...col, todos: col.todos.filter((t) => t.id !== selected.id) }
            : col.id === destinationColumnId
            ? { ...col, todos: [...col.todos, todo] }
            : col
        );
      });
      return updatedColumns;
    });
    setSelectedTodos((prev) =>
      prev.map((todo) => ({ ...todo, columnId: destinationColumnId }))
    );
  };

  const filteredColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        todos: col.todos
          .filter((todo) =>
            todo.description.toLowerCase().includes(searchTodo.toLowerCase())
          )
          .filter((todo) => (filterComplete ? todo.isCompleted : true)),
      })),
    [filterComplete, searchTodo, columns]
  );

  const editTodo = (
    todoId: string,
    columnId: string,
    newDescription: string
  ) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              todos: col.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, description: newDescription }
                  : todo
              ),
            }
          : col
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  return (
    <TodoContext.Provider
      value={{
        columns: filteredColumns,
        editTodo,
        selectedTodos,
        addColumn,
        deleteColumn,
        addTodo,
        completeTodo,
        removeTodo,
        moveTodo,
        reorderTodo,
        reorderColumns,
        filterComplete,
        toggleFilter,
        searchTodo,
        setSearchTodo,
        toggleSelectTodo,
        selectAllTodosInColumn,
        deselectAllTodosInColumn,
        selectAllTodos,
        deselectAllTodos,
        deleteSelectedTodos,
        completeSelectedTodos,
        incompleteSelectedTodos,
        moveSelectedTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const todoContext = useContext(TodoContext);

  if (!todoContext) throw new Error("No todo context");
  return todoContext;
};
