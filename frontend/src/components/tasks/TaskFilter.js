/**
 * Task Filter and Search Controller
 */
export class TaskFilter {
  constructor({ onFilterChange }) {
    this.onFilterChange = onFilterChange;
    this.activeStatus = 'all'; // 'all' | 'pending' | 'in_progress' | 'completed' | 'high'
    this.searchQuery = '';
    this.init();
  }

  init() {
    const filterButtons = document.querySelectorAll('.task-filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeStatus = btn.dataset.filter || 'all';
        this.emit();
      });
    });

    const searchInput = document.getElementById('tasks-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.emit();
      });
    }
  }

  emit() {
    if (this.onFilterChange) {
      this.onFilterChange({
        status: this.activeStatus,
        query: this.searchQuery,
      });
    }
  }

  apply(tasks) {
    return tasks.filter((task) => {
      // 1. Status/priority filter
      if (this.activeStatus === 'pending' && task.status !== 'pending') return false;
      if (this.activeStatus === 'in_progress' && task.status !== 'in_progress') return false;
      if (this.activeStatus === 'completed' && task.status !== 'completed') return false;
      if (this.activeStatus === 'high' && task.priority !== 'high') return false;

      // 2. Search query filter
      if (this.searchQuery) {
        const titleMatch = (task.title || '').toLowerCase().includes(this.searchQuery);
        const descMatch = (task.description || '').toLowerCase().includes(this.searchQuery);
        return titleMatch || descMatch;
      }

      return true;
    });
  }
}
