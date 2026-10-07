/**
 * Dashboard Priority Tasks List
 */
export function createPriorityList(tasks = [], onToggleStatus = null, onNavigateTasks = null) {
  const container = document.createElement('div');
  container.className = 'dashboard-section-card';

  const highPriorityTasks = tasks
    .filter((t) => t.priority === 'high' || t.status !== 'completed')
    .slice(0, 5);

  let listHtml = '';
  if (highPriorityTasks.length === 0) {
    listHtml = `
      <div class="empty-compact">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>No urgent pending tasks! You are all caught up.</span>
      </div>
    `;
  } else {
    listHtml = `
      <div class="priority-items-list">
        ${highPriorityTasks
          .map((task) => {
            const isDone = task.status === 'completed';
            const dueLabel = task.due_date
              ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : 'No deadline';

            return `
              <div class="priority-item ${isDone ? 'is-completed' : ''}" data-task-id="${task.id}">
                <button class="priority-checkbox ${isDone ? 'checked' : ''}" data-task-id="${task.id}" aria-label="Toggle task status">
                  ${isDone ? '✓' : ''}
                </button>
                <div class="priority-item-info">
                  <div class="priority-item-title ${isDone ? 'line-through' : ''}">${task.title}</div>
                  <div class="priority-item-meta">
                    <span class="badge badge-${task.priority === 'high' ? 'danger' : 'warning'} badge-xs">
                      ${task.priority.toUpperCase()}
                    </span>
                    <span class="priority-date">📅 ${dueLabel}</span>
                  </div>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="dashboard-section-header">
      <div>
        <h3 class="section-title">Priority Tasks</h3>
        <p class="section-subtitle">Items that require immediate academic attention</p>
      </div>
      <button class="btn btn-sm btn-ghost view-all-btn">View All →</button>
    </div>
    ${listHtml}
  `;

  // Attach status toggle
  if (onToggleStatus) {
    container.querySelectorAll('.priority-checkbox').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = btn.dataset.taskId;
        onToggleStatus(taskId);
      });
    });
  }

  // View all tasks
  const viewAllBtn = container.querySelector('.view-all-btn');
  if (viewAllBtn && onNavigateTasks) {
    viewAllBtn.addEventListener('click', onNavigateTasks);
  }

  return container;
}
