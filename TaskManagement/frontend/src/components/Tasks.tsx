import React, { useState, useEffect } from 'react';
import api from '../api';

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching tasks');
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', {
        title: newTaskTitle,
        description: newTaskDescription,
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating task');
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const res = await api.put(`/tasks/${task.id}`, {
        ...task,
        isComplete: !task.isComplete, // toggle complete status
      });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating task');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting task');
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={createTask}>
        <div>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Task description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: '1rem 0' }}>
            <h3 style={{ textDecoration: task.isComplete ? 'line-through' : 'none' }}>
              {task.title}
            </h3>
            {task.description && <p>{task.description}</p>}
            <button onClick={() => updateTask(task)}>
              {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '0.5rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
