import React, { useState, useEffect } from 'react';
import { reminderService } from '../services/reminderService';
import { ReminderList } from '../components/reminders/ReminderList';
import { ReminderForm } from '../components/reminders/ReminderForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Plus } from 'lucide-react';

export const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReminders = async () => {
    try {
      const data = await reminderService.getReminders();
      setReminders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreateReminder = async (data) => {
    await reminderService.createReminder(data);
    setIsModalOpen(false);
    fetchReminders();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this reminder?')) {
      await reminderService.deleteReminder(id);
      fetchReminders();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">Never miss an upcoming deadline or event.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Reminder
        </Button>
      </div>

      {loading ? <Loading text="Loading reminders..." /> : (
        <ReminderList reminders={reminders} onDelete={handleDelete} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Reminder">
        <ReminderForm onSubmit={handleCreateReminder} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
