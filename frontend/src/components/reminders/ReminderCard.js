/**
 * Reminder Card Component
 */
export function createReminderCard({
  reminder,
  onToggleComplete = null,
  onEdit = null,
  onDelete = null,
}) {
  const card = document.createElement('div');
  const isDone = reminder.is_completed;
  card.className = `reminder-card ${isDone ? 'is-completed' : ''}`;
  card.dataset.id = reminder.id;

  const timeDate = new Date(reminder.reminder_time);
  const now = new Date();
  const diffHours = Math.round((timeDate - now) / (1000 * 60 * 60));

  let timeBadgeText = `${diffHours}h left`;
  let timeBadgeColor = 'cyan';
  if (isDone) {
    timeBadgeText = 'Completed';
    timeBadgeColor = 'emerald';
  } else if (diffHours < 0) {
    timeBadgeText = 'Overdue';
    timeBadgeColor = 'danger';
  } else if (diffHours < 24) {
    timeBadgeText = 'Due Today';
    timeBadgeColor = 'amber';
  } else {
    const days = Math.round(diffHours / 24);
    timeBadgeText = `In ${days} day${days > 1 ? 's' : ''}`;
  }

  const formattedDateTime = timeDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: timeDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
  });

  card.innerHTML = `
    <div class="reminder-left">
      <button class="reminder-checkbox ${isDone ? 'checked' : ''}" title="Toggle complete">
        ${isDone ? '✓' : ''}
      </button>
      <div class="reminder-content">
        <h4 class="reminder-title ${isDone ? 'line-through' : ''}">${reminder.title}</h4>
        ${
          reminder.description
            ? `<p class="reminder-desc">${reminder.description}</p>`
            : ''
        }
        <div class="reminder-meta">
          <span class="reminder-timestamp">🕒 ${formattedDateTime}</span>
          <span class="badge badge-${timeBadgeColor} badge-xs">${timeBadgeText}</span>
        </div>
      </div>
    </div>

    <div class="reminder-actions">
      <button class="btn-icon-sm btn-edit-rem" title="Edit Reminder">✏️</button>
      <button class="btn-icon-sm btn-delete-rem" title="Delete Reminder">🗑️</button>
    </div>
  `;

  card.querySelector('.reminder-checkbox').addEventListener('click', () => {
    onToggleComplete && onToggleComplete(reminder.id, !reminder.is_completed);
  });

  card.querySelector('.btn-edit-rem').addEventListener('click', () => {
    onEdit && onEdit(reminder);
  });

  card.querySelector('.btn-delete-rem').addEventListener('click', () => {
    onDelete && onDelete(reminder.id, reminder.title);
  });

  return card;
}
