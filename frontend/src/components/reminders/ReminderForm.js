import ModalManager from '../common/Modal.js';
import { Toast } from '../common/ErrorMessage.js';

/**
 * Reminder Form Modal Manager
 */
export class ReminderFormModal {
  constructor({ onSubmit }) {
    this.onSubmit = onSubmit;
    this.currentEditingId = null;
    this.init();
  }

  init() {
    const form = document.getElementById('reminder-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('rem-input-title').value.trim();
      const description = document.getElementById('rem-input-desc').value.trim();
      const timeVal = document.getElementById('rem-input-time').value;

      if (!title || !timeVal) {
        Toast.error('Please enter both title and reminder date/time.');
        return;
      }

      const reminderData = {
        title,
        description: description || null,
        reminder_time: new Date(timeVal).toISOString(),
      };

      const submitBtn = document.getElementById('rem-form-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      try {
        await this.onSubmit(this.currentEditingId, reminderData);
        ModalManager.close('modal-reminder');
        form.reset();
        this.currentEditingId = null;
      } catch (err) {
        Toast.error(err.message || 'Failed to save reminder');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Reminder';
        }
      }
    });
  }

  openCreate() {
    this.currentEditingId = null;
    const modalTitle = document.getElementById('modal-rem-title');
    if (modalTitle) modalTitle.textContent = 'Add Reminder';

    const form = document.getElementById('reminder-form');
    if (form) form.reset();

    // Default to tomorrow 09:00
    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setHours(9, 0, 0, 0);
    // Format YYYY-MM-DDTHH:mm
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
    const timeInput = document.getElementById('rem-input-time');
    if (timeInput) timeInput.value = localIso;

    ModalManager.open('modal-reminder');
  }

  openEdit(rem) {
    this.currentEditingId = rem.id;
    const modalTitle = document.getElementById('modal-rem-title');
    if (modalTitle) modalTitle.textContent = 'Edit Reminder';

    document.getElementById('rem-input-title').value = rem.title || '';
    document.getElementById('rem-input-desc').value = rem.description || '';

    if (rem.reminder_time) {
      const d = new Date(rem.reminder_time);
      const pad = (n) => String(n).padStart(2, '0');
      const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      document.getElementById('rem-input-time').value = localIso;
    }

    ModalManager.open('modal-reminder');
  }
}
