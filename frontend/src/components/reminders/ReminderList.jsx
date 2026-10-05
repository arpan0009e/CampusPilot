import React from 'react';
import { ReminderCard } from './ReminderCard';
import { EmptyState } from '../common/EmptyState';

export const ReminderList = ({ reminders, onDelete }) => {
  if (reminders.length === 0) {
    return <EmptyState title="No reminders set" description="Add reminders to stay on top of your deadlines." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {reminders.map(r => (
        <ReminderCard key={r.id} reminder={r} onDelete={onDelete} />
      ))}
    </div>
  );
};
