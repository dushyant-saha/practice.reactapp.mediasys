import React, { useState, useEffect, useRef } from 'react';



export default function TodoApp() {
  console.log("refresh")
  const [todos, setTodos] = useState(() => {
    try {
      console.log("useState todos")
      const savedTodos = localStorage.getItem('my_todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    }
    catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [editState, setEditState] = useState([false, null]);
  const editIdRef = useRef("");

  useEffect(() => {
    console.log("useEffect localStorage.setItem")
    localStorage.setItem('my_todos', JSON.stringify(todos));
  }, [todos]);


  const handleEditTodo = (id) => {
    const updatedText = editIdRef.current;
    if (updatedText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: updatedText } : todo
        )
      );
    }
    // Reset edit state back to default
    setEditState([false, null]);
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    console.log('handleAddTodo');
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  // console.log(todos);
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <section className='custom-row'>

      <div className="todo-container">
        <h2 className="todo-title">My To Do</h2>

        {/* Input Form */}
        <form onSubmit={handleAddTodo} className="todo-form">
          <input type="text" className="todo-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Add new task" name="task" />
          <button type="submit" className="add-button">+</button>
        </form>

        {/* Todo List Display */}
        <ul className="item-list">
          {todos.length === 0 ? (<p className="empty-message">No tasks yet! Add one above.</p>) : (
            todos.map((todo) => (
              
              <TodoItem key={todo.id} id={todo.id} text={todo.text} completed={todo.completed} handleToggleTodo={handleToggleTodo} 
              handleDeleteTodo={handleDeleteTodo} editState={editState} setEditState={setEditState} editIdRef={editIdRef} handleEditTodo={handleEditTodo}/>
            ))
            
          )}
        </ul>
      </div>

      <TodoCount todos={todos}/>
    </section>
  );
}

function TodoItem({ id, text, completed, handleToggleTodo, handleDeleteTodo, editState, setEditState, editIdRef, handleEditTodo }) {
  return (
    <li key={id} className="todo-item">
      <div className="todo-content" onDoubleClick={() => { setEditState([true, id]); }}>
        {/* onClick={() => handleToggleTodo(id)} */}
        <div className='todo-checkbox-container'>
          <input type="checkbox" checked={completed} onChange={() => handleToggleTodo(id)} className="todo-checkbox" />
        </div>
        {(editState[0]==true && editState[1]==id) ? (<textarea type="text" className={`todo-text ${completed ? 'completed' : ''}`} name='text-content' onChange={(e) => editIdRef.current = e.target.value}>{text}</textarea>) : (
          <span className={`todo-text ${completed ? 'completed' : ''}`}>{text}</span>)
        }
      </div>
      <div className='button-container'>
        {(editState[0]==true && editState[1]==id) ? (
          <button onClick={() => handleEditTodo(id)} className="custom-button save-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
          </svg>
        </button>) : (
          <button onClick={() => handleDeleteTodo(id)} className="custom-button delete-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>)}
      </div>
    </li>
  );
}

function TodoCount({todos}){
  const countArray = todos.map((todo)=>(todo.completed === false));
  return(
    <p className='todo-count'>Your remaining todos : {countArray.length}</p>
  );
}