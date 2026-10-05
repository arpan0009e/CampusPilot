import React from 'react';
import { NoteCard } from './NoteCard';
import { EmptyState } from '../common/EmptyState';

export const NoteList = ({ notes, onDelete }) => {
  if (notes.length === 0) {
    return <EmptyState title="No notes found" description="Create a new note to start building your knowledge base." />;
  }

  return (
    <div className="grid-2">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
};
