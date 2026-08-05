import React, { useState, useEffect, useRef } from 'react';

function TodoForm(props) {
  return (
    <form className={`inner-form ${props.isExpanded ? 'expanded' : ''}`}>

      {props.isExpanded && (
        <input type="text" placeholder="Title" className="input-title" value={props.title} onChange={(e) => props.setTitle(e.target.value)} />
      )}

      <textarea placeholder="Take a note..." className="input-note" rows={props.isExpanded ? 3 : 1} value={props.note} onFocus={() => props.setIsExpanded(true)} onChange={(e) => props.setNote(e.target.value)} />

      {props.isExpanded && (
        <div className="form-actions">
          <button type="button" className="form-button" onClick={props.handleSave}>
            Save
          </button>
          <button type="button" className="form-button" onClick={props.handleClose}>
            Close
          </button>
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
        {props.note && (
          <div className="todo-card-note">{props.note}</div>
        )}
      </div>
      {!props.isExpanded && <button onClick={() => props.editHandler(props.id)} className="edit-btn">Edit</button>}
      <button onClick={() => props.deleteHandler(props.id)} className="delete-btn">Delete</button>
    </li>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const formRef = useRef(null);
  const editRef = useRef(null);

  // Load saved notes
  useEffect(() => {
    console.log("load")
    const saved = localStorage.getItem('my_todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Saving notes
  useEffect(() => {
    //if()
    localStorage.setItem('my_todos', JSON.stringify(todos));
    console.log("SAVE N CLEAR on every todo change")
  }, [todos]);

  // Collapse and save on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (title.trim() || note.trim()) {
          saveTodo(editRef.current);
        }
        setIsExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, note]);

  // Saving for code for todo item
  const saveTodo = (id) => {
    debugger;
    if (!title.trim() && !note.trim()) return;

    if(!id){
      const newTodo = {
        id: Date.now(),
        title: title.trim() || 'Untitled Note',
        note: note.trim(),
      };
  
      setTodos([newTodo, ...todos]);
    }else{
      const editedTodoList = todos.map((list)=>{
       return list.id === id ? {...list, title:title, note:note} : list;
      });
      setTodos(editedTodoList);
      editRef.current = null;
    }
    setTitle('');
    setNote('');
  };

  //Event handlers:
  const handleClose = (e) => {
    e.preventDefault();
    setIsExpanded(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    debugger;
    saveTodo(editRef.current);
    setIsExpanded(false);
  };

  const handleEditTodo = (id) => {
    setIsExpanded(true);
    const todoItem = todos.find(todo => todo.id == id);
    // setTodos(todos.filter((todo) => todo.id !== id));
    setTitle(todoItem.title);
    setNote(todoItem.note);
    editRef.current = id;
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="form-container" ref={formRef}>
        <TodoForm isExpanded={isExpanded} note={note} title={title} setIsExpanded={setIsExpanded} setNote={setNote} setTitle={setTitle} handleSave={handleSave} handleClose={handleClose}/>
      </div>

      {/* Todo List Cards LIst */}
      <div className="todo-list-container">
        {todos.length === 0 ? (
          <p className="empty-message">No notes saved yet. Add one above!</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoItem key={todo.id} id={todo.id} title={todo.title} note={todo.note} deleteHandler={handleDeleteTodo} editHandler={handleEditTodo} isExpanded={isExpanded}/>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}