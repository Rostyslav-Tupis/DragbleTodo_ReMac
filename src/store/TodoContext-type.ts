import type { ColumnType } from "@/types/todo-type";

export interface TodoContextType {
  columns: ColumnType[];
  selectedTodos: { id: string; columnId: string }[];
  addColumn: (title: string) => void;
  deleteColumn: (id: string) => void;
  addTodo: (description: string, columnId: string) => void;
  completeTodo: (todoId: string, columnId: string) => void;
  removeTodo: (todoId: string, columnId: string) => void;
  moveTodo: (
    todoId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    index?: number
  ) => void;
  reorderTodo: (
    columnId: string,
    startIndex: number,
    finishIndex: number
  ) => void;
  reorderColumns: (startIndex: number, finishIndex: number) => void;
  filterComplete: boolean;
  toggleFilter: () => void;
  searchTodo: string;
  setSearchTodo: React.Dispatch<React.SetStateAction<string>>;
  toggleSelectTodo: (todoId: string, columnId: string) => void;
  selectAllTodosInColumn: (columnId: string) => void;
  deselectAllTodosInColumn: (columnId: string) => void;
  selectAllTodos: () => void;
  deselectAllTodos: () => void;
  deleteSelectedTodos: () => void;
  completeSelectedTodos: () => void;
  incompleteSelectedTodos: () => void;
  moveSelectedTodos: (destinationColumnId: string) => void;
  editTodo: (todoId: string, columnId: string, newDescription: string) => void;
}
