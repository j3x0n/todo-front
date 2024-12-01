import { useContext, useState } from 'react';
import { Task, TaskContext } from './context/TaskContext.tsx';
import { AuthContext } from './context/AuthContext';
import './App.scss'

function App() {
  const {tasks, loading, addTask, updateTask, goPage, setSort, totalPages, currentPage} = useContext(TaskContext)!;
  const {token, login, logout} = useContext(AuthContext)!;

  const [newTask, setNewTask] = useState({username: '', email: '', description: ''});
  const [email, setEmail] = useState('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedTask, setEditedTask] = useState<number | null>(null);
  const [password, setPassword] = useState('');

  const handleAddTask = async () => {
    await addTask(newTask);
    setNewTask({username: '', email: '', description: ''});
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    await updateTask(id, updates);
  };

  const handleLogin = async () => {
      await login(email, password);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div className='admin'>
        {!token ? (
          <>
            <input
              type='email'
              placeholder='имя'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='пароль'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Войти</button>
          </>
        ) : (
          <button onClick={logout}>Выйти</button>
        )}
      </div>

      {/* Task List */}
      <div>
        <h2>Задачи</h2>
        <div className='sorting'>
          <button onClick={() => setSort('id')}>Сортировка по id</button>
          <button onClick={() => setSort('email')}>Сортировка по Email</button>
          <button onClick={() => setSort('username')}>Сортировка по Имя</button>
          <button onClick={() => setSort('completed')}>Сортировка по Завершено</button>
        </div>
        <div className='task'>
          <strong>Имя:</strong>
          <strong>Email:</strong>
          <strong>Текст:</strong>
          <strong>Завершено:</strong>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className='task'>
            <span>{task.username}</span>
            <span>{task.email}</span>
                <input
                  disabled={!token}
                  type='text'
                  value={task.id === editedTask ? editedDescription : task.description}
                  onFocus={() => {setEditedDescription(task.description); setEditedTask(task.id)}}
                  onBlur={() => {handleUpdateTask(task.id, {description: editedDescription}); setEditedDescription(''); setEditedTask(null)}}
                  onChange={(e) => setEditedDescription( e.target.value)}
                />
                <input
                  type='checkbox'
                  disabled={!token}
                  checked={task.completed}
                  onChange={e =>
                    handleUpdateTask(task.id, {completed: e.target.checked})
                }/>

          </div>
        ))}
        <div className='pagination'>
          <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>
            ←
          </button>
          <span>
            {currentPage}/{totalPages}
          </span>
          <button onClick={() => goPage(currentPage + 1)} disabled={currentPage >= totalPages}>
            →
          </button>
        </div>
      </div>

      {/* Add New Task */}
      <div className='new'>
        <input
          type='text'
          placeholder='Имя'
          value={newTask.username}
          onChange={(e) => setNewTask({...newTask, username: e.target.value})}
        />
        <input
          type='email'
          placeholder='Email'
          value={newTask.email}
          onChange={(e) => setNewTask({...newTask, email: e.target.value})}
        />
        <input
          placeholder='Текст'
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <button onClick={handleAddTask}>Добавить</button>
      </div>
    </div>
  );
}

export default App;
