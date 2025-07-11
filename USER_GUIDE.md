# Todo Board User Guide

This guide explains how to use the Todo Board application.

## Getting Started

After starting the application (see `README.md` for setup instructions), you will see a Kanban board with columns and tasks. The interface is intuitive and supports both mouse (desktop) and touch (mobile) interactions.

## Using the Application

### 1. Creating a Column

- **Action**: To add a new column to the board:
  - Locate the input field labeled "Add column" at the top of the board.
  - Enter the desired column title.
  - Press **Enter** or click the **Add** button next to the input field.
- **Result**: A new column with the specified title appears on the board.
- **Note**: The column title cannot be empty. If you try to submit an empty title, no column will be created.

### 2. Adding a Task

- **Action**: To add a task to a specific column:
  - Find the input field labeled "Add task" inside the desired column.
  - Enter the task description.
  - Press **Enter** or click the **Add task** button next to the input field.
- **Result**: A new task appears in the column.
- **Note**: The task description cannot be empty. If you submit an empty description, no task will be created.

### 3. Marking a Task as Completed

- **Action**: To toggle a task's completion status:
  - Click on the task’s description text (not the checkbox or icons).
- **Result**:
  - If the task was incomplete, it will be marked as completed (indicated by a strikethrough and reduced opacity).
  - If the task was completed, it will be marked as incomplete (strikethrough and opacity are removed).
- **Note**: This action toggles the completion status with a single click.

### 4. Selecting Tasks for Bulk Actions

- **Action**: To select tasks for bulk operations:
  - Click the **checkbox** next to a task’s description to select it.
  - Alternatively, use the **Select All** button in a column to select all tasks in that column, or **Deselect All** to clear the selection.
- **Result**: Selected tasks are highlighted, and additional buttons appear at the top of the board:
  - **Mark as Completed**: Marks all selected tasks as completed.
  - **Mark as Incomplete**: Marks all selected tasks as incomplete.
  - **Delete Selected**: Deletes all selected tasks.
  - **Deselect All**: Clears the selection of all tasks.
  - **Move**: Allows moving selected tasks to another column:
    - Select a target column from the dropdown menu labeled "Move to...".
    - Click the **Move** button to transfer the selected tasks to the chosen column.
- **Note**: The **Move** button is disabled until a target column is selected from the dropdown.

### 5. Deleting a Task

- **Action**: To delete a task:
  - Click the **trash can icon** next to the task’s description.
- **Result**: The task is permanently removed from the column.
- **Note**: This action cannot be undone, so use it carefully.

### 6. Deleting a Column

- **Action**: To delete a column:
  - Click the **red cross (✕)** button in the top-right corner of the column.
- **Result**: The entire column, including all its tasks, is permanently removed.
- **Note**: This action cannot be undone. Ensure you want to delete the column and its tasks before proceeding.

### 7. Editing a Task

- **Action**: To edit a task’s description:
  - Click the **pencil icon** next to the task’s description text.
  - An input field will appear with the current description.
  - Modify the text as needed.
  - Save the changes by:
    - Pressing **Enter**.
    - Clicking outside the input field (on blur).
- **Result**:
  - If the edited text is not empty, the task’s description is updated.
  - If the edited text is empty, the changes are discarded, and the original description is restored.
- **Note**: Editing is canceled if you leave the input field empty and save.

### 8. Reordering Columns and Tasks (Drag-and-Drop)

- Click and hold a column’s header or a task’s card.
- Drag it to the desired position:
  - For columns: Move left or right to reorder among other columns.
  - For tasks: Move up or down within a column or to another column.
- A purple drop indicator shows where the column or task will be placed:
  - Vertical line (left/right) for columns.
  - Horizontal line (top/bottom) for tasks.
- Release the mouse to drop the item in place.
- **Result**: Columns or tasks are reordered or moved to the new position/column.
- **Note**: Drag-and-drop works seamlessly on both desktop and mobile devices.
