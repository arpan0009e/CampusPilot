/**
 * Common Empty State Component
 */
export function createEmptyState({
  title = 'No Items Found',
  description = 'You currently have no entries here. Get started by adding a new one.',
  actionText = '',
  actionIcon = '',
  onAction = null,
  icon = 'clipboard',
}) {
  const container = document.createElement('div');
  container.className = 'empty-state-card';

  const icons = {
    clipboard: `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="M9 14h6"></path><path d="M9 18h6"></path><path d="M9 10h1"></path>
      </svg>
    `,
    book: `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    `,
    bell: `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    `,
    bot: `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8" y2="16"></line>
        <line x1="16" y1="16" x2="16" y2="16"></line>
      </svg>
    `,
  };

  container.innerHTML = `
    <div class="empty-state-icon">
      ${icons[icon] || icons.clipboard}
    </div>
    <h3 class="empty-state-title">${title}</h3>
    <p class="empty-state-desc">${description}</p>
    ${
      actionText
        ? `<button class="btn btn-primary btn-md empty-state-btn">
            ${actionIcon ? `<span class="btn-icon">${actionIcon}</span>` : ''}
            <span>${actionText}</span>
          </button>`
        : ''
    }
  `;

  if (actionText && onAction) {
    const btn = container.querySelector('.empty-state-btn');
    if (btn) btn.addEventListener('click', onAction);
  }

  return container;
}
