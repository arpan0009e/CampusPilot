import { createNoteCard } from './NoteCard.js';
import { createEmptyState } from '../common/EmptyState.js';

/**
 * Note List Component
 */
export function renderNoteList({
  container,
  notes,
  activeTopic = 'all',
  searchQuery = '',
  onEdit,
  onDelete,
  onSummarize,
  onFlashcards,
  onQuiz,
  onCreateNew,
}) {
  if (!container) return;
  container.innerHTML = '';

  // Filter notes
  const filtered = notes.filter((n) => {
    if (activeTopic !== 'all' && (n.topic || '').toLowerCase() !== activeTopic.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = (n.title || '').toLowerCase().includes(q);
      const inContent = (n.content || '').toLowerCase().includes(q);
      const inTopic = (n.topic || '').toLowerCase().includes(q);
      return inTitle || inContent || inTopic;
    }
    return true;
  });

  if (filtered.length === 0) {
    const empty = createEmptyState({
      title: 'No Study Notes Found',
      description: 'You have no notes in this category yet. Create your first lecture note to enable AI flashcards & summaries!',
      actionText: '+ Create Study Note',
      onAction: onCreateNew,
      icon: 'book',
    });
    container.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'notes-cards-grid';

  filtered.forEach((note) => {
    const card = createNoteCard({
      note,
      onEdit,
      onDelete,
      onSummarize,
      onFlashcards,
      onQuiz,
    });
    grid.appendChild(card);
  });

  container.appendChild(grid);
}
