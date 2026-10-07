/**
 * Dashboard Summary KPI Card
 */
export function createSummaryCard({
  title,
  value,
  subtitle = '',
  icon = '',
  color = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan'
  badge = '',
  trend = '',
  onClick = null,
}) {
  const card = document.createElement('div');
  card.className = `summary-card summary-card-${color} ${onClick ? 'is-clickable' : ''}`;

  card.innerHTML = `
    <div class="summary-card-header">
      <span class="summary-card-title">${title}</span>
      <div class="summary-card-icon-wrapper color-${color}">
        ${icon}
      </div>
    </div>
    <div class="summary-card-value">${value}</div>
    <div class="summary-card-footer">
      ${badge ? `<span class="badge badge-${color}">${badge}</span>` : ''}
      ${subtitle ? `<span class="summary-card-subtitle">${subtitle}</span>` : ''}
      ${trend ? `<span class="summary-card-trend">${trend}</span>` : ''}
    </div>
  `;

  if (onClick) {
    card.addEventListener('click', onClick);
  }

  return card;
}
