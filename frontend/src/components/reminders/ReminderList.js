import { createReminderCard } from './ReminderCard.js';
import { createEmptyState } from '../common/EmptyState.js';

/**
 * Reminder List Component
 */
export function renderReminderList({
  container,
  reminders,
  filter = 'all', // 'all' | 'pending' | 'completed'
  searchQuery = '',
  onToggleComplete,
  onEdit,
  onDelete,
  onCreateNew,
}) {
  if (!container) return;
  container.innerHTML = '';

  const filtered = reminders.filter((r) => {
    if (filter === 'pending' && r.is_completed) return false;
    if (filter === 'completed' && !r.is_completed) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = (r.title || '').toLowerCase().includes(q);
      const inDesc = (r.description || '').toLowerCase().includes(q);
      return inTitle || inDesc;
    }
    return true;
  });

  if (filtered.length === 0) {
    const empty = createEmptyState({
      title: 'No Reminders',
      description: 'You have no study reminders or assignment alerts scheduled in this tab.',
      actionText: '+ Add Reminder',
      onAction: onCreateNew,
      icon: 'bell',
    });
    container.appendChild(empty);
    return;
  }

  // Sort by reminder_time ascending
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.reminder_time) - new Date(b.reminder_time)
  );

  const listDiv = document.createElement('div');
  listDiv.className = 'reminders-list-container';

  sorted.forEach((rem) => {
    const card = createReminderCard({
      reminder: rem,
      onToggleComplete,
      onEdit,
      onDelete,
    });
    listDiv.appendChild(card);
  });

  container.appendChild(listDiv);
}
