/**
 * Dashboard Upcoming Reminders List
 */
export function createUpcomingList(reminders = [], onToggleReminder = null, onNavigateReminders = null) {
  const container = document.createElement('div');
  container.className = 'dashboard-section-card';

  const sorted = [...reminders]
    .sort((a, b) => new Date(a.reminder_time) - new Date(b.reminder_time))
    .slice(0, 4);

  let contentHtml = '';
  if (sorted.length === 0) {
    contentHtml = `
      <div class="empty-compact">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>No upcoming deadlines or alerts scheduled.</span>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="upcoming-items-list">
        ${sorted
          .map((rem) => {
            const timeDate = new Date(rem.reminder_time);
            const isDone = rem.is_completed;
            const diffHours = Math.round((timeDate - new Date()) / (1000 * 60 * 60));
            let badgeText = `${diffHours}h left`;
            let badgeClass = 'badge-cyan';
            if (diffHours < 0) {
              badgeText = 'Past due';
              badgeClass = 'badge-danger';
            } else if (diffHours < 24) {
              badgeText = 'Today';
              badgeClass = 'badge-warning';
            } else {
              const days = Math.round(diffHours / 24);
              badgeText = `In ${days} day${days > 1 ? 's' : ''}`;
            }

            return `
              <div class="upcoming-item ${isDone ? 'is-completed' : ''}" data-rem-id="${rem.id}">
                <button class="reminder-checkbox ${isDone ? 'checked' : ''}" data-rem-id="${rem.id}">
                  ${isDone ? '✓' : ''}
                </button>
                <div class="upcoming-item-details">
                  <div class="upcoming-item-title ${isDone ? 'line-through' : ''}">${rem.title}</div>
                  <div class="upcoming-item-time">
                    <span>🕒 ${timeDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <span class="badge ${badgeClass} badge-xs">${badgeText}</span>
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
        <h3 class="section-title">Upcoming Reminders</h3>
        <p class="section-subtitle">Academic deadlines and study alerts</p>
      </div>
      <button class="btn btn-sm btn-ghost view-reminders-btn">All Reminders →</button>
    </div>
    ${contentHtml}
  `;

  if (onToggleReminder) {
    container.querySelectorAll('.reminder-checkbox').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onToggleReminder(btn.dataset.remId);
      });
    });
  }

  const viewBtn = container.querySelector('.view-reminders-btn');
  if (viewBtn && onNavigateReminders) {
    viewBtn.addEventListener('click', onNavigateReminders);
  }

  return container;
}
