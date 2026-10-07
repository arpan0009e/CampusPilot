/**
 * Common Modal Dialog Controller
 */
export class ModalManager {
  static open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus first interactive element
    const firstInput = modal.querySelector('input, textarea, select, button:not(.btn-close)');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  }

  static close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  static initGlobalListeners() {
    // Backdrop click and close button handlers
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-overlay') || e.target.closest('[data-modal-close]')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal && modal.id) {
          ModalManager.close(modal.id);
        }
      }
    });

    // ESC key closes active modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay.is-open');
        if (openModal && openModal.id) {
          ModalManager.close(openModal.id);
        }
      }
    });
  }
}

export default ModalManager;
