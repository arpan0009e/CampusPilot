import taskService from '../services/taskService.js';
import chatService from '../services/chatService.js';
import { renderTaskList } from '../components/tasks/TaskList.js';
import { TaskFormModal } from '../components/tasks/TaskForm.js';
import { TaskFilter } from '../components/tasks/TaskFilter.js';
import ModalManager from '../components/common/Modal.js';
import { Toast } from '../components/common/ErrorMessage.js';

/**
 * Tasks Page Controller
 */
export class TasksPageController {
  constructor() {
    this.tasks = [];
    this.filterController = null;
    this.taskFormModal = null;
    this.init();
  }

  init() {
    this.taskFormModal = new TaskFormModal({
      onSubmit: async (id, taskData) => {
        if (id) {
          await taskService.updateTask(id, taskData);
          Toast.success('Task updated successfully!');
        } else {
          await taskService.createTask(taskData);
          Toast.success('Task created successfully!');
        }
        await this.loadTasks();
      },
      onGetAISuggestions: async ({ title, description }) => {
        await this.showAITaskBreakdown({ title, description });
      },
    });

    const addBtn = document.getElementById('tasks-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.taskFormModal.openCreate();
      });
    }

    this.filterController = new TaskFilter({
      onFilterChange: () => this.render(),
    });
  }

  async loadTasks() {
    const listContainer = document.getElementById('tasks-list-container');
    if (listContainer) {
      listContainer.innerHTML = '<div class="loading-state"><div class="spinner-ring"></div><span>Loading tasks...</span></div>';
    }

    try {
      this.tasks = await taskService.getTasks();
      this.render();
    } catch (err) {
      console.error(err);
      Toast.error('Failed to load tasks.');
    }
  }

  render() {
    const listContainer = document.getElementById('tasks-list-container');
    if (!listContainer) return;

    const filtered = this.filterController ? this.filterController.apply(this.tasks) : this.tasks;

    renderTaskList({
      container: listContainer,
      tasks: filtered,
      onStatusChange: async (id, newStatus) => {
        try {
          await taskService.updateTask(id, { status: newStatus });
          Toast.success(`Status changed to ${newStatus}`);
          await this.loadTasks();
        } catch (err) {
          Toast.error(err.message || 'Failed to update status');
        }
      },
      onEdit: (task) => {
        this.taskFormModal.openEdit(task);
      },
      onDelete: (id, title) => {
        this.confirmDelete(id, title);
      },
      onAIBreakdown: (task) => {
        this.showAITaskBreakdown(task);
      },
      onCreateNew: () => {
        this.taskFormModal.openCreate();
      },
    });

    // Update count labels
    const countEl = document.getElementById('tasks-total-badge');
    if (countEl) {
      countEl.textContent = `${this.tasks.length} tasks`;
    }
  }

  confirmDelete(id, title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      taskService
        .deleteTask(id)
        .then(() => {
          Toast.success('Task removed');
          this.loadTasks();
        })
        .catch((err) => Toast.error(err.message || 'Failed to delete task'));
    }
  }

  async showAITaskBreakdown(task) {
    ModalManager.open('modal-ai-breakdown');
    const contentBox = document.getElementById('ai-breakdown-modal-content');
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="ai-modal-loading">
          <div class="spinner-ring lg"></div>
          <p>Analyzing assignment scope and generating smart milestone breakdown...</p>
        </div>
      `;
    }

    try {
      const data = await chatService.getTaskSuggestions({
        title: task.title,
        description: task.description || '',
        subject: 'Coursework',
        available_hours_per_day: 2.0,
      });

      const subtasks = data.subtasks || [];
      const tips = data.study_tips || [];
      const pitfalls = data.pitfalls_to_avoid || [];

      if (contentBox) {
        contentBox.innerHTML = `
          <div class="ai-breakdown-result">
            <div class="ai-breakdown-header">
              <span class="badge badge-ai">✨ AI Recommendation</span>
              <h4>${task.title}</h4>
              <div class="ai-meta-pills">
                <span class="badge badge-warning">Priority: ${(data.suggested_priority || 'medium').toUpperCase()}</span>
                <span class="badge badge-cyan">Est. Time: ${data.estimated_total_minutes || 90} mins</span>
              </div>
              <p class="ai-reasoning"><em>"${data.priority_reason || 'Assignment milestone schedule.'}"</em></p>
            </div>

            <h5 class="subtasks-section-title">Actionable Milestones (${subtasks.length}):</h5>
            <div class="ai-subtasks-list">
              ${subtasks
                .map(
                  (st, idx) => `
                    <div class="ai-subtask-item">
                      <div class="subtask-num">${idx + 1}</div>
                      <div class="subtask-text">
                        <div class="subtask-title">${st.title}</div>
                        ${st.description ? `<p class="subtask-desc">${st.description}</p>` : ''}
                      </div>
                      <span class="subtask-time">⏱️ ${st.estimated_minutes}m</span>
                    </div>
                  `
                )
                .join('')}
            </div>

            ${
              tips.length > 0
                ? `
              <div class="ai-tips-box">
                <h6>💡 Productivity Tips:</h6>
                <ul>
                  ${tips.map((tip) => `<li>${tip}</li>`).join('')}
                </ul>
              </div>
            `
                : ''
            }

            ${
              pitfalls.length > 0
                ? `
              <div class="ai-pitfalls-box">
                <h6>⚠️ Common Pitfalls:</h6>
                <ul>
                  ${pitfalls.map((p) => `<li>${p}</li>`).join('')}
                </ul>
              </div>
            `
                : ''
            }

            <div class="ai-modal-footer-actions">
              <button class="btn btn-primary" id="btn-import-subtasks">
                + Add All Milestones as Subtasks
              </button>
            </div>
          </div>
        `;

        const importBtn = document.getElementById('btn-import-subtasks');
        if (importBtn) {
          importBtn.addEventListener('click', async () => {
            importBtn.disabled = true;
            importBtn.textContent = 'Adding subtasks...';
            for (const st of subtasks) {
              await taskService.createTask({
                title: st.title,
                description: st.description || `Subtask for ${task.title}`,
                priority: data.suggested_priority || 'medium',
                status: 'pending',
              });
            }
            Toast.success(`Added ${subtasks.length} subtasks to your task board!`);
            ModalManager.close('modal-ai-breakdown');
            this.loadTasks();
          });
        }
      }
    } catch (err) {
      if (contentBox) {
        contentBox.innerHTML = `
          <div class="error-banner">
            <p>Could not generate breakdown: ${err.message || 'Please try again.'}</p>
          </div>
        `;
      }
    }
  }
}

export let tasksController = null;
export function initTasksPage() {
  if (!tasksController) {
    tasksController = new TasksPageController();
  }
  tasksController.loadTasks();
}
