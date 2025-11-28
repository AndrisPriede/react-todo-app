import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'todo-app-tasks';


const initialTasks = [
  { id: 1, text: 'Finish Web Application Development lab', completed: false },
  { id: 2, text: 'Go to boxing training', completed: false },
];


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
  
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());

  const [newTask, setNewTask] = useState('');

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  
  const handleSubmit = (event) => {
    event.preventDefault(); 

    const trimmed = newTask.trim();
    if (!trimmed) {
      return; 
    }

    const newItem = {
      id: Date.now(), 
      text: trimmed,
      completed: false,
    };

    setTasks([...tasks, newItem]);
    setNewTask('');
  };

  
  const handleDelete = (idToDelete) => {
    setTasks(tasks.filter((task) => task.id !== idToDelete));
  };

 
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

        
        <p className="stats">
          {totalCount === 0
            ? 'No tasks yet. Add your first one!'
            : `${completedCount} of ${totalCount} tasks completed`}
        </p>

        
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
