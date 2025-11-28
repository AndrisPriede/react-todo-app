import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'todo-app-tasks';

// начальные задачи по умолчанию
const initialTasks = [
  { id: 1, text: 'Finish Web Application Development lab', completed: false },
  { id: 2, text: 'Go to boxing training', completed: false },
];

// загрузка задач из localStorage
function loadTasksFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialTasks;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initialTasks;
    return parsed;
  } catch (e) {
    return initialTasks;
  }
}

function App() {
  // список задач
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  // текст в поле ввода
  const [newTask, setNewTask] = useState('');

  // при каждом изменении задач сохраняем их в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // добавление задачи
  const handleSubmit = (event) => {
    event.preventDefault(); // не перезагружать страницу

    const trimmed = newTask.trim();
    if (!trimmed) {
      return; // пустую строку не добавляем
    }

    const newItem = {
      id: Date.now(), // простой уникальный id
      text: trimmed,
      completed: false,
    };

    setTasks([...tasks, newItem]);
    setNewTask('');
  };

  // удаление задачи
  const handleDelete = (idToDelete) => {
    setTasks(tasks.filter((task) => task.id !== idToDelete));
  };

  // переключение “выполнено / не выполнено”
  const handleToggleComplete = (idToToggle) => {
    setTasks(
      tasks.map((task) =>
        task.id === idToToggle
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="todo-card">
        <h1 className="title">My ToDo Application</h1>
        <p className="subtitle">Simple React ToDo app for laboratory work</p>

        {/* Статистика по задачам */}
        <p className="stats">
          {totalCount === 0
            ? 'No tasks yet. Add your first one!'
            : `${completedCount} of ${totalCount} tasks completed`}
        </p>

        {/* Форма добавления задачи */}
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a new task..."
            className="todo-input"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="todo-button">
            Add
          </button>
        </form>

        {/* Список задач */}
        {tasks.length > 0 && (
          <ul className="todo-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`todo-item ${
                  task.completed ? 'todo-item--done' : ''
                }`}
              >
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />
                  <span className="task-text">{task.text}</span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
