import React, { useState, useEffect, useRef } from 'react';

function TodoForm(props) {
  const handleItemChange = (index, value) => {
    const updated = [...props.noteItems];
    updated[index].text = value;
    props.setNoteItems(updated);
  };

  // Toggle checkbox state in the form
  const handleToggle = (index) => {
    const updated = [...props.noteItems];
    updated[index].completed = !updated[index].completed;
    props.setNoteItems(updated);
  };

  // Add new line on Enter key
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const updated = [...props.noteItems];
      updated.splice(index + 1, 0, { id: Date.now(), text: '', completed: false });
      props.setNoteItems(updated);
    } else if (e.key === 'Backspace' && props.noteItems[index].text === '' && props.noteItems.length > 1) {
      e.preventDefault();
      const updated = props.noteItems.filter((arrayElement, itemIndex) => itemIndex !== index);
      props.setNoteItems(updated);
    }
  };

  return (
    <form className={`inner-form ${props.isExpanded ? 'expanded' : ''}`}>
      {props.isExpanded && (
        <input
          type="text"
          placeholder="Title"
          className="input-title"
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
        />
      )}

      {/*Checkbox List in Form */}
      <div className="note-items-container" onClick={() => props.setIsExpanded(true)}>
        {props.noteItems.map((item, index) => (
          <div key={item.id} className="todo-input-row">
            {props.isExpanded && (
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(index)}
              />
            )}
            <input
              type="text"
              placeholder={index === 0 ? "Take a note..." : "List item"}
              className={`input-note-line ${item.completed ? 'completed' : ''}`}
              value={item.text}
              onFocus={() => props.setIsExpanded(true)}
              onChange={(e) => handleItemChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          </div>
        ))}
      </div>

      {props.isExpanded && (
        <div className="form-actions">
          <button type="button" className="form-button" onClick={props.handleSave}>Save</button>
          <button type="button" className="form-button" onClick={props.handleClose}>Close</button>
        </div>
      )}
    </form>
  );
}

function TodoItem(props) {
  return (
    <li className="todo-card" onDoubleClick={() => props.editHandler(props.id)}>
      <div className="todo-card-body">
        <div className="todo-card-title">{props.title}</div>
        
        {/* Render checklist items */}
        <div className="todo-card-checklist">
          {props.noteItems && props.noteItems.map((item) => (
            <label key={item.id} className="checklist-row">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => props.toggleTaskHandler(props.id, item.id)}
              />
              <span className={item.completed ? 'completed-text' : ''}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={() => props.editHandler(props.id)} className="edit-btn">Edit</button>
      <button onClick={() => props.deleteHandler(props.id)} className="delete-btn">Delete</button>
    </li>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('my_todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  
  // Default to one empty line item
  const [noteItems, setNoteItems] = useState([
    { id: Date.now(), text: '', completed: false }
  ]);

  const formRef = useRef(null);
  const editRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('my_todos', JSON.stringify(todos));
  }, [todos]);

  const resetForm = () => {
    setTitle('');
    setNoteItems([{ id: Date.now(), text: '', completed: false }]);
    editRef.current = null;
    setIsExpanded(false);
  };

  const saveTodo = (id) => {
    // Filter out completely empty lines
    const cleanedItems = noteItems.filter((item) => item.text.trim() !== '');
    const trimmedTitle = title.trim();

    if (!trimmedTitle && cleanedItems.length === 0) {
      resetForm();
      return;
    }

    if (!id) {
      const newTodo = {
        id: Date.now(),
        title: trimmedTitle || 'Untitled Note',
        noteItems: cleanedItems,
      };
      setTodos((prev) => [newTodo, ...prev]);
    } else {
      setTodos((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, title: trimmedTitle || 'Untitled Note', noteItems: cleanedItems }
            : item
        )
      );
    }

    resetForm();
  };

  // Direct toggle on a saved card item
  const handleToggleTask = (todoId, taskId) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          noteItems: todo.noteItems.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      })
    );
  };

  const handleEditTodo = (id) => {
    const todoItem = todos.find((todo) => todo.id === id);
    if (!todoItem) return;

    setTitle(todoItem.title);
    setNoteItems(
      todoItem.noteItems.length > 0
        ? todoItem.noteItems
        : [{ id: Date.now(), text: '', completed: false }]
    );
    editRef.current = id;
    setIsExpanded(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="form-container" ref={formRef}>
        <TodoForm
          isExpanded={isExpanded}
          noteItems={noteItems}
          title={title}
          setIsExpanded={setIsExpanded}
          setNoteItems={setNoteItems}
          setTitle={setTitle}
          handleSave={() => saveTodo(editRef.current)}
          handleClose={resetForm}
        />
      </div>

      <div className="todo-list-container">
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              noteItems={todo.noteItems}
              deleteHandler={(id) => setTodos((prev) => prev.filter((t) => t.id !== id))}
              editHandler={handleEditTodo}
              toggleTaskHandler={handleToggleTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}