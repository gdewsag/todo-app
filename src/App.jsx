
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  
  useEffect(() => {
  const savedTodos = localStorage.getItem('todos');
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';

  if (savedTodos) {
    try {
      const parsedTodos = JSON.parse(savedTodos);

      // Проверяем, что parsedTodos — это массив
      if (!Array.isArray(parsedTodos)) {
        throw new Error('Saved todos are not an array');
      }

      // Проверяем структуру каждого элемента
      const isValidTodos = parsedTodos.every(todo => 
        typeof todo === 'object' && 
        'id' in todo && 
        'text' in todo && 
        'completed' in todo
      );

      if (!isValidTodos) {
        throw new Error('Invalid todo structure in saved todos');
      }

      setTodos(parsedTodos);
    } catch (e) {
      console.error('Ошибка загрузки задач:', e);
      // При ошибке можно установить пустой массив или очистить localStorage
      setTodos([]);
      localStorage.removeItem('todos');
    }
  }

  setDarkMode(savedDarkMode);
  document.documentElement.classList.toggle('dark', savedDarkMode);
}, []);
  
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [todos,darkMode]);

const addTodo = () => {
  if (inputValue.trim() === '') return;
  setTodos([
    ...todos,
    { id: Date.now(), text: inputValue.trim(), completed: false }
  ]);
  setInputValue('');
}

const toggleTodo = (id) => {
  setTodos(
    todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
};

const deleteTodo = (id) => {
  setTodos(todos.filter(todo => todo.id !== id));
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') addTodo();
};

return (
  <div className='app'>
    <div className='container'>
      <header>
        <h1>Мои задачи</h1>
        <button
          className='theme-toggle'
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️' : '🌙'}  
        </button> 
      </header>

      <div className='input-section'>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Добавьте новую задачу...'
          className='todo-input'
        />
        <button onClick={addTodo}>
          Добавить
        </button>
      </div>

      <div className='todos-list'>
        {todos.length === 0 ? (
          <p className='empty-text'>Список задач пуст</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className='todo-checkbox'>
              <label className='todo-checkbox'>
                <input
                  type='checkbox'
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.text}
                </span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className='delete-btn'
              >
              ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className='stats'>
        Всего: {todos.length} | Выполнено: {todos.filter(t => t.completed).length}
      </div>
    </div>
  </div>
);
}

export default App;
