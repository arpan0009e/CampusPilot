import ModalManager from '../common/Modal.js';
import { Toast } from '../common/ErrorMessage.js';

/**
 * Note Form Modal Manager
 */
export class NoteFormModal {
  constructor({ onSubmit }) {
    this.onSubmit = onSubmit;
    this.currentEditingId = null;
    this.init();
  }

  init() {
    const form = document.getElementById('note-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const topic = document.getElementById('note-input-topic').value.trim();
      const title = document.getElementById('note-input-title').value.trim();
      const content = document.getElementById('note-input-content').value.trim();

      if (!topic || !title || !content) {
        Toast.error('Please complete all required fields (Topic, Title, Content)');
        return;
      }

      const noteData = { topic, title, content };

      const submitBtn = document.getElementById('note-form-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      try {
        await this.onSubmit(this.currentEditingId, noteData);
        ModalManager.close('modal-note');
        form.reset();
        this.currentEditingId = null;
      } catch (err) {
        Toast.error(err.message || 'Failed to save note');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Note';
        }
      }
    });
  }

  openCreate(defaultTopic = '') {
    this.currentEditingId = null;
    const modalTitle = document.getElementById('modal-note-title');
    if (modalTitle) modalTitle.textContent = 'Create New Note';

    const form = document.getElementById('note-form');
    if (form) form.reset();

    if (defaultTopic) {
      document.getElementById('note-input-topic').value = defaultTopic;
    }

    ModalManager.open('modal-note');
  }

  openEdit(note) {
    this.currentEditingId = note.id;
    const modalTitle = document.getElementById('modal-note-title');
    if (modalTitle) modalTitle.textContent = 'Edit Note';

    document.getElementById('note-input-topic').value = note.topic || '';
    document.getElementById('note-input-title').value = note.title || '';
    document.getElementById('note-input-content').value = note.content || '';

    ModalManager.open('modal-note');
  }
}
