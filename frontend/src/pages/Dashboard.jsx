import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { noteService } from '../services/noteService';
import { reminderService } from '../services/reminderService';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { PriorityList } from '../components/dashboard/PriorityList';
import { UpcomingList } from '../components/dashboard/UpcomingList';
import { AISuggestion } from '../components/dashboard/AISuggestion';
import { AIPopupWidget } from '../components/dashboard/AIPopupWidget';
import { Loading } from '../components/common/Loading';
import { CheckSquare, BookOpen, Bell, Sparkles, Plus, X } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, n, r] = await Promise.all([
          taskService.getTasks(),
          noteService.getNotes(),
          reminderService.getReminders()
        ]);
        setTasks(t);
        setNotes(n);
        setReminders(r);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading text="Loading Dashboard..." />;

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'High');

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="page-subtitle">Here is your academic overview for today.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/tasks')}>
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* AI Suggestion */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AISuggestion suggestion="You have 2 high-priority tasks due this week. Focus on Math Assignment #4 first." />
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <SummaryCard title="Pending Tasks" count={pendingTasks.length} icon={CheckSquare} color="#3b82f6" />
        <SummaryCard title="Total Tasks" count={tasks.length} icon={CheckSquare} color="#10b981" />
        <SummaryCard title="Saved Notes" count={notes.length} icon={BookOpen} color="#8b5cf6" />
        <SummaryCard title="Reminders" count={reminders.length} icon={Bell} color="#f59e0b" />
      </div>

      {/* Lists */}
      <div className="grid-2">
        <PriorityList tasks={highPriorityTasks} />
        <UpcomingList reminders={reminders} />
      </div>

      {/* Floating Circular Ask AI Popup Button on Right Side */}
      <button
        onClick={() => setIsChatPopupOpen(prev => !prev)}
        className="floating-ai-btn"
        title={isChatPopupOpen ? "Close Assistant" : "Ask CampusPilot AI"}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2.5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 6px 20px rgba(2, 132, 199, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 90,
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {isChatPopupOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Quick AI Chat Popup Widget */}
      <AIPopupWidget 
        isOpen={isChatPopupOpen} 
        onClose={() => setIsChatPopupOpen(false)} 
      />
    </div>
  );
};
