import ModalManager from '../common/Modal.js';
import { Toast } from '../common/ErrorMessage.js';

/**
 * Task Form Modal Manager
 */
export class TaskFormModal {
  constructor({ onSubmit, onGetAISuggestions }) {
    this.onSubmit = onSubmit;
    this.onGetAISuggestions = onGetAISuggestions;
    this.currentEditingId = null;
    this.init();
  }

  init() {
    const form = document.getElementById('task-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('task-input-title').value.trim();
      const description = document.getElementById('task-input-desc').value.trim();
      const priority = document.getElementById('task-input-priority').value;
      const status = document.getElementById('task-input-status').value;
      const dueDateVal = document.getElementById('task-input-duedate').value;

      if (!title) {
        Toast.error('Please enter a task title');
        return;
      }

      const taskData = {
        title,
        description: description || null,
        priority: priority || 'medium',
        status: status || 'pending',
        due_date: dueDateVal ? new Date(dueDateVal).toISOString() : null,
      };

      const submitBtn = document.getElementById('task-form-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      try {
        await this.onSubmit(this.currentEditingId, taskData);
        ModalManager.close('modal-task');
        form.reset();
        this.currentEditingId = null;
      } catch (err) {
        Toast.error(err.message || 'Failed to save task');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Task';
        }
      }
    });

    const aiBreakdownBtn = document.getElementById('task-form-ai-help-btn');
    if (aiBreakdownBtn && this.onGetAISuggestions) {
      aiBreakdownBtn.addEventListener('click', () => {
        const title = document.getElementById('task-input-title').value.trim();
        const description = document.getElementById('task-input-desc').value.trim();
        if (!title) {
          Toast.warning('Enter a task title first so AI can analyze it.');
          return;
        }
        this.onGetAISuggestions({ title, description });
      });
    }
  }

  openCreate() {
    this.currentEditingId = null;
    const modalTitle = document.getElementById('modal-task-title');
    if (modalTitle) modalTitle.textContent = 'Create New Task';

    const form = document.getElementById('task-form');
    if (form) form.reset();

    const statusGroup = document.getElementById('task-status-form-group');
    if (statusGroup) statusGroup.style.display = 'none';

    ModalManager.open('modal-task');
  }

  openEdit(task) {
    this.currentEditingId = task.id;
    const modalTitle = document.getElementById('modal-task-title');
    if (modalTitle) modalTitle.textContent = 'Edit Task';

    document.getElementById('task-input-title').value = task.title || '';
    document.getElementById('task-input-desc').value = task.description || '';
    document.getElementById('task-input-priority').value = (task.priority || 'medium').toLowerCase();
    document.getElementById('task-input-status').value = (task.status || 'pending').toLowerCase();

    const statusGroup = document.getElementById('task-status-form-group');
    if (statusGroup) statusGroup.style.display = 'block';

    if (task.due_date) {
      const d = new Date(task.due_date);
      // Format to YYYY-MM-DD
      const iso = d.toISOString().split('T')[0];
      document.getElementById('task-input-duedate').value = iso;
    } else {
      document.getElementById('task-input-duedate').value = '';
    }

    ModalManager.open('modal-task');
  }
}
