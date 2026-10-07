/**
 * Common Button component creator
 */
export function createButton({
  text = '',
  icon = '',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'ai'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  id = '',
  className = '',
  onClick = null,
  disabled = false,
  title = '',
}) {
  const btn = document.createElement('button');
  btn.type = type;
  if (id) btn.id = id;
  if (title) btn.title = title;
  btn.className = `btn btn-${variant} btn-${size} ${className}`.trim();
  btn.disabled = disabled;

  let content = '';
  if (icon) {
    content += `<span class="btn-icon">${icon}</span>`;
  }
  if (text) {
    content += `<span class="btn-text">${text}</span>`;
  }
  btn.innerHTML = content;

  if (onClick) {
    btn.addEventListener('click', onClick);
  }

  return btn;
}

export function setButtonLoading(btn, isLoading, loadingText = 'Processing...') {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
      <span class="btn-spinner" aria-hidden="true"></span>
      <span class="btn-text">${loadingText}</span>
    `;
  } else {
    btn.disabled = false;
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
    }
  }
}
