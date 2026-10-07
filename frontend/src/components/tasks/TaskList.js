import { createTaskCard } from './TaskCard.js';
import { createEmptyState } from '../common/EmptyState.js';

/**
 * Task List Component
 */
export function renderTaskList({
  container,
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onAIBreakdown,
  onCreateNew,
}) {
  if (!container) return;
  container.innerHTML = '';

  if (!tasks || tasks.length === 0) {
    const empty = createEmptyState({
      title: 'No Tasks Found',
      description: 'You have no tasks matching this filter. Create one to organize your coursework!',
      actionText: '+ Add New Task',
      onAction: onCreateNew,
      icon: 'clipboard',
    });
    container.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'task-cards-grid';

  tasks.forEach((task) => {
    const card = createTaskCard({
      task,
      onStatusChange,
      onEdit,
      onDelete,
      onAIBreakdown,
    });
    grid.appendChild(card);
  });

  container.appendChild(grid);
}
