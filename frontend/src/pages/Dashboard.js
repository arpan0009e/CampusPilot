import taskService from '../services/taskService.js';
import noteService from '../services/noteService.js';
import reminderService from '../services/reminderService.js';
import authContext from '../context/AuthContext.js';
import { createSummaryCard } from '../components/dashboard/SummaryCard.js';
import { createPriorityList } from '../components/dashboard/PriorityList.js';
import { createUpcomingList } from '../components/dashboard/UpcomingList.js';
import { Toast } from '../components/common/ErrorMessage.js';

/**
 * Dashboard Page Controller
 */
export async function renderDashboardPage() {
  const container = document.getElementById('dashboard-content');
  if (!container) return;

  const user = authContext.user;
  const greetingEl = document.getElementById('dashboard-greeting-name');
  if (greetingEl) {
    greetingEl.textContent = user?.name ? user.name.split(' ')[0] : 'Student';
  }

  // Set greeting subtitle
  const deptEl = document.getElementById('dashboard-greeting-dept');
  if (deptEl) {
    deptEl.textContent = user?.department
      ? `${user.department}${user.semester ? ' • ' + user.semester : ''}`
      : 'Academic Workspace';
  }

  try {
    // Parallel data fetch
    const [tasks, notes, reminders] = await Promise.all([
      taskService.getTasks(),
      noteService.getNotes(),
      reminderService.getReminders(),
    ]);

    // Compute Metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    const totalNotes = notes.length;
    const upcomingReminders = reminders.filter((r) => !r.is_completed).length;

    // Render KPI Grid
    const kpiGrid = document.getElementById('dashboard-kpi-grid');
    if (kpiGrid) {
      kpiGrid.innerHTML = '';

      const cardPending = createSummaryCard({
        title: 'Pending Tasks',
        value: pendingTasks,
        subtitle: `${completedTasks} completed`,
        color: 'amber',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        onClick: () => (window.location.hash = '#tasks'),
      });

      const cardTasks = createSummaryCard({
        title: 'Total Tasks',
        value: totalTasks,
        subtitle: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% done`,
        color: 'indigo',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        onClick: () => (window.location.hash = '#tasks'),
      });

      const cardNotes = createSummaryCard({
        title: 'Study Notes',
        value: totalNotes,
        subtitle: 'AI enabled',
        color: 'cyan',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
        onClick: () => (window.location.hash = '#notes'),
      });

      const cardReminders = createSummaryCard({
        title: 'Upcoming Alerts',
        value: upcomingReminders,
        subtitle: 'Scheduled deadines',
        color: 'rose',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
        onClick: () => (window.location.hash = '#reminders'),
      });

      kpiGrid.appendChild(cardPending);
      kpiGrid.appendChild(cardTasks);
      kpiGrid.appendChild(cardNotes);
      kpiGrid.appendChild(cardReminders);
    }

    // Render Middle Widgets: Priority Tasks & Upcoming Reminders
    const widgetsRow = document.getElementById('dashboard-widgets-row');
    if (widgetsRow) {
      widgetsRow.innerHTML = '';

      const priorityWidget = createPriorityList(
        tasks,
        async (taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (!task) return;
          const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
          await taskService.updateTask(taskId, { status: nextStatus });
          Toast.success(`Task updated to ${nextStatus}`);
          renderDashboardPage();
        },
        () => (window.location.hash = '#tasks')
      );

      const upcomingWidget = createUpcomingList(
        reminders,
        async (remId) => {
          const rem = reminders.find((r) => r.id === remId);
          if (!rem) return;
          await reminderService.updateReminder(remId, { is_completed: !rem.is_completed });
          Toast.success(`Reminder marked ${!rem.is_completed ? 'completed' : 'pending'}`);
          renderDashboardPage();
        },
        () => (window.location.hash = '#reminders')
      );

      widgetsRow.appendChild(priorityWidget);
      widgetsRow.appendChild(upcomingWidget);
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    Toast.error('Could not load some dashboard metrics.');
  }
}
