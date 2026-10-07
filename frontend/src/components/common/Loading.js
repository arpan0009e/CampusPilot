/**
 * Common Loading components and overlay
 */
export function createSpinner(text = 'Loading...') {
  const el = document.createElement('div');
  el.className = 'loading-state';
  el.innerHTML = `
    <div class="spinner-ring" role="status" aria-label="loading"></div>
    <span class="loading-text">${text}</span>
  `;
  return el;
}

export function createSkeletonCards(count = 3) {
  const container = document.createElement('div');
  container.className = 'skeleton-grid';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card shimmer';
    card.innerHTML = `
      <div class="skeleton-line title"></div>
      <div class="skeleton-line text"></div>
      <div class="skeleton-line text short"></div>
    `;
    container.appendChild(card);
  }
  return container;
}

export const GlobalLoader = {
  show(text = 'Loading CampusPilot...') {
    let loader = document.getElementById('global-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'global-loader';
      loader.className = 'global-loader-overlay';
      loader.innerHTML = `
        <div class="global-loader-content">
          <div class="spinner-ring lg"></div>
          <p id="global-loader-text" class="global-loader-text">${text}</p>
        </div>
      `;
      document.body.appendChild(loader);
    } else {
      const textEl = document.getElementById('global-loader-text');
      if (textEl) textEl.textContent = text;
      loader.style.display = 'flex';
    }
  },

  hide() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  },
};
