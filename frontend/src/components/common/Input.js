/**
 * Common Input component helper
 */
export function createInputGroup({
  id,
  label,
  type = 'text',
  placeholder = '',
  value = '',
  required = false,
  helpText = '',
  icon = '',
  options = [], // For select inputs
  rows = 4, // For textarea
}) {
  const container = document.createElement('div');
  container.className = 'form-group';

  let inputHtml = '';
  if (type === 'textarea') {
    inputHtml = `
      <textarea
        id="${id}"
        name="${id}"
        class="form-control"
        placeholder="${placeholder}"
        rows="${rows}"
        ${required ? 'required' : ''}
      >${value}</textarea>
    `;
  } else if (type === 'select') {
    const opts = options
      .map((opt) => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const text = typeof opt === 'object' ? opt.label : opt;
        const isSelected = val === value ? 'selected' : '';
        return `<option value="${val}" ${isSelected}>${text}</option>`;
      })
      .join('');

    inputHtml = `
      <select id="${id}" name="${id}" class="form-control" ${required ? 'required' : ''}>
        ${opts}
      </select>
    `;
  } else {
    inputHtml = `
      <div class="input-wrapper ${icon ? 'has-icon' : ''}">
        ${icon ? `<span class="input-icon">${icon}</span>` : ''}
        <input
          type="${type}"
          id="${id}"
          name="${id}"
          class="form-control"
          placeholder="${placeholder}"
          value="${value}"
          ${required ? 'required' : ''}
        />
      </div>
    `;
  }

  container.innerHTML = `
    <label for="${id}" class="form-label">
      ${label} ${required ? '<span class="text-danger">*</span>' : ''}
    </label>
    ${inputHtml}
    ${helpText ? `<small class="form-help">${helpText}</small>` : ''}
    <div class="form-error" id="${id}-error" style="display: none;"></div>
  `;

  return container;
}

export function setInputError(inputId, errorMessage) {
  const errEl = document.getElementById(`${inputId}-error`);
  const inputEl = document.getElementById(inputId);
  if (errEl) {
    if (errorMessage) {
      errEl.textContent = errorMessage;
      errEl.style.display = 'block';
      if (inputEl) inputEl.classList.add('is-invalid');
    } else {
      errEl.textContent = '';
      errEl.style.display = 'none';
      if (inputEl) inputEl.classList.remove('is-invalid');
    }
  }
}
