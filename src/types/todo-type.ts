export type TodoType = {
  id: string;
  description: string;
  isCompleted: boolean;
};

export type ColumnType = {
  id: string;
  title: string;
  todos: TodoType[];
};
