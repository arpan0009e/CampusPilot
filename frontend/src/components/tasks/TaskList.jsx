import React from 'react';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';

export const TaskList = ({ tasks, onToggleStatus, onDelete }) => {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks found" description="Create a new task to get started." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onToggleStatus={onToggleStatus} onDelete={onDelete} />
      ))}
    </div>
  );
};
