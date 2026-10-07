/**
 * Task Card Component - Clean, simple, student-friendly design
 */
export function createTaskCard({
  task,
  onStatusChange = null,
  onEdit = null,
  onDelete = null,
  onAIBreakdown = null,
}) {
  const card = document.createElement('div');
  const isDone = task.status === 'completed';
  card.className = `task-card ${isDone ? 'is-completed' : ''}`;
  card.dataset.id = task.id;

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Done',
  };

  let formattedDate = 'No deadline';
  let isOverdue = false;
  if (task.due_date) {
    const d = new Date(task.due_date);
    formattedDate = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
    if (!isDone && d.getTime() < Date.now()) {
      isOverdue = true;
    }
  }

  card.innerHTML = `
    <div class="task-card-top">
      <div class="task-tags">
        <span class="tag tag-priority-${task.priority || 'medium'}">
          ${priorityLabels[task.priority] || 'Medium'}
        </span>
        <span class="tag tag-status-${task.status || 'pending'}">
          ${statusLabels[task.status] || 'Pending'}
        </span>
        ${isOverdue ? '<span class="tag tag-overdue">Overdue</span>' : ''}
      </div>

      <div class="task-card-actions">
        <button class="btn-task-action btn-breakdown" title="Plan subtasks">
          Milestones
        </button>
        <button class="btn-task-action btn-edit" title="Edit">
          Edit
        </button>
        <button class="btn-task-action btn-delete" title="Delete">
          ✕
        </button>
      </div>
    </div>

    <div class="task-card-body">
      <h3 class="task-card-title ${isDone ? 'line-through' : ''}">${task.title}</h3>
      ${
        task.description
          ? `<p class="task-card-desc">${task.description}</p>`
          : ''
      }
    </div>

    <div class="task-card-footer">
      <div class="task-due-date">
        <span>📅</span>
        <span>${formattedDate}</span>
      </div>

      <div class="task-status-dropdown-wrap">
        <select class="task-status-select" data-id="${task.id}" aria-label="Change status">
          <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </div>
    </div>
  `;

  // Attach event handlers
  const statusSelect = card.querySelector('.task-status-select');
  if (statusSelect && onStatusChange) {
    statusSelect.addEventListener('change', (e) => {
      onStatusChange(task.id, e.target.value);
    });
  }

  const editBtn = card.querySelector('.btn-edit');
  if (editBtn && onEdit) {
    editBtn.addEventListener('click', () => onEdit(task));
  }

  const deleteBtn = card.querySelector('.btn-delete');
  if (deleteBtn && onDelete) {
    deleteBtn.addEventListener('click', () => onDelete(task.id, task.title));
  }

  const aiBtn = card.querySelector('.btn-breakdown');
  if (aiBtn && onAIBreakdown) {
    aiBtn.addEventListener('click', () => onAIBreakdown(task));
  }

  return card;
}
