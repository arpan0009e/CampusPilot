import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilter } from '../components/tasks/TaskFilter';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Plus } from 'lucide-react';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    await taskService.createTask(taskData);
    setIsModalOpen(false);
    fetchTasks();
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await taskService.updateTask(task.id, { status: newStatus });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await taskService.deleteTask(id);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pending') return t.status === 'Pending';
    if (filter === 'Completed') return t.status === 'Completed';
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks Management</h1>
          <p className="page-subtitle">Track, filter, and organize your academic tasks.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Task
        </Button>
      </div>

      <TaskFilter filter={filter} setFilter={setFilter} />

      {loading ? <Loading text="Loading tasks..." /> : (
        <TaskList tasks={filteredTasks} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
