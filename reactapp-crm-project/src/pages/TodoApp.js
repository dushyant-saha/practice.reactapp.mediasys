import React, { useState, useEffect, useRef } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const formRef = useRef(null);

  // Load saved notes
  useEffect(() => {
    const saved = localStorage.getItem('my_todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Saving notes
  useEffect(() => {
    localStorage.setItem('my_todos', JSON.stringify(todos));
  }, [todos]);

  // Collapse and save on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (title.trim() || note.trim()) {
          saveTodo();
        }
        setIsExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, note]);

  // Saving for code for todo item
  const saveTodo = () => {
    if (!title.trim() && !note.trim()) return;

    const newTodo = {
      id: Date.now(),
      title: title.trim() || 'Untitled Note',
      note: note.trim(),
    };

    setTodos([newTodo, ...todos]);
    setTitle('');
    setNote('');
  };

  const handleClose = (e) => {
    e.preventDefault();
    saveTodo();
    setIsExpanded(false);
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="form-container" ref={formRef}>
        <form className={`inner-form ${isExpanded ? 'expanded' : ''}`}>
          
          {isExpanded && (
            <input
              type="text"
              placeholder="Title"
              className="input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}

          <textarea
            placeholder="Take a note..."
            className="input-note"
            rows={isExpanded ? 3 : 1}
            value={note}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => setNote(e.target.value)}
          />

          {isExpanded && (
            <div className="form-actions">
              <button type="button" className="close-button" onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Todo List Cards LIst */}
      <div className="todo-list-container">
        {todos.length === 0 ? (
          <p className="empty-message">No notes saved yet. Add one above!</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-card">
                <div className="todo-card-body">
                  <div className="todo-card-title">{todo.title}</div>
                  {todo.note && (
                    <div className="todo-card-note">{todo.note}</div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}