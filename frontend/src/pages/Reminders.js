import reminderService from '../services/reminderService.js';
import { renderReminderList } from '../components/reminders/ReminderList.js';
import { ReminderFormModal } from '../components/reminders/ReminderForm.js';
import { Toast } from '../components/common/ErrorMessage.js';

/**
 * Reminders Page Controller
 */
export class RemindersPageController {
  constructor() {
    this.reminders = [];
    this.filter = 'all'; // 'all' | 'pending' | 'completed'
    this.searchQuery = '';
    this.reminderFormModal = null;
    this.init();
  }

  init() {
    this.reminderFormModal = new ReminderFormModal({
      onSubmit: async (id, data) => {
        if (id) {
          await reminderService.updateReminder(id, data);
          Toast.success('Reminder updated!');
        } else {
          await reminderService.createReminder(data);
          Toast.success('Reminder scheduled!');
        }
        await this.loadReminders();
      },
    });

    const addBtn = document.getElementById('reminders-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.reminderFormModal.openCreate();
      });
    }

    const filterBtns = document.querySelectorAll('.rem-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter || 'all';
        this.render();
      });
    });

    const searchInput = document.getElementById('reminders-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.render();
      });
    }
  }

  async loadReminders() {
    const listContainer = document.getElementById('reminders-list-container');
    if (listContainer) {
      listContainer.innerHTML = '<div class="loading-state"><div class="spinner-ring"></div><span>Loading reminders...</span></div>';
    }

    try {
      this.reminders = await reminderService.getReminders();
      this.render();
    } catch (err) {
      console.error(err);
      Toast.error('Failed to load reminders.');
    }
  }

  render() {
    const listContainer = document.getElementById('reminders-list-container');
    if (!listContainer) return;

    renderReminderList({
      container: listContainer,
      reminders: this.reminders,
      filter: this.filter,
      searchQuery: this.searchQuery,
      onToggleComplete: async (id, isCompleted) => {
        try {
          await reminderService.updateReminder(id, { is_completed: isCompleted });
          Toast.success(`Reminder marked as ${isCompleted ? 'completed' : 'pending'}`);
          await this.loadReminders();
        } catch (err) {
          Toast.error(err.message || 'Failed to update reminder');
        }
      },
      onEdit: (rem) => {
        this.reminderFormModal.openEdit(rem);
      },
      onDelete: (id, title) => {
        this.confirmDelete(id, title);
      },
      onCreateNew: () => {
        this.reminderFormModal.openCreate();
      },
    });

    const countEl = document.getElementById('reminders-total-badge');
    if (countEl) {
      countEl.textContent = `${this.reminders.length} reminders`;
    }
  }

  confirmDelete(id, title) {
    if (confirm(`Delete reminder "${title}"?`)) {
      reminderService
        .deleteReminder(id)
        .then(() => {
          Toast.success('Reminder deleted');
          this.loadReminders();
        })
        .catch((err) => Toast.error(err.message || 'Failed to delete reminder'));
    }
  }
}

export let remindersController = null;
export function initRemindersPage() {
  if (!remindersController) {
    remindersController = new RemindersPageController();
  }
  remindersController.loadReminders();
}
