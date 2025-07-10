Todo Board
A Kanban-style task management board built with React, TypeScript, and Vite. The project allows users to create columns, add tasks, edit tasks, and drag-and-drop both columns and tasks. It supports both desktop (mouse) and mobile (touch) interactions.
Features

Create Columns: Add new columns to organize tasks.
Add Tasks: Create tasks within columns using an input field.
Edit Tasks: Double-click a task to edit its description, save with Enter or on blur.
Drag-and-Drop: Reorder columns and tasks via drag-and-drop on both desktop and mobile devices.
Task Selection: Select multiple tasks for bulk actions (mark as complete/incomplete, move, or delete).
Responsive Design: Adapts to mobile and desktop screens.

Prerequisites

Node.js: Version 18 or higher.
npm: Version 8 or higher (comes with Node.js).
Git: For cloning the repository.

Installation

Clone the Repository:
git clone <repository-url>
cd <repository-folder>

Install Dependencies:
npm install

Run the Development Server:
npm run dev

This starts the Vite development server. Open http://localhost:5173 in your browser to view the app.

Scripts

npm run dev: Starts the development server with Vite.
npm run build: Builds the project for production.
npm run preview: Previews the production build locally.

Usage

Add a Column:
Enter a column title in the input field at the top and click "Add" or press Enter.

Add a Task:
In a column, enter a task description in the input field and click "Add task" or press Enter.

Edit a Task:
Double-click a task’s description to edit it. Save by pressing Enter or clicking outside.

Drag-and-Drop:
On desktop: Click and drag columns or tasks to reorder them.
On mobile: Touch and drag columns or tasks to reorder them.
Drop indicators (purple lines) show where the item will be placed.

Select Tasks:
Check the checkbox on a task to select it.
Use "Select All" or "Deselect All" buttons in a column for bulk selection.
Selected tasks can be marked as complete/incomplete, moved to another column, or deleted.
