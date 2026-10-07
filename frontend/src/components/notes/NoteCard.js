/**
 * Note Card Component with AI study triggers
 */
export function createNoteCard({
  note,
  onEdit = null,
  onDelete = null,
  onSummarize = null,
  onFlashcards = null,
  onQuiz = null,
}) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.dataset.id = note.id;

  const topic = note.topic || 'General';
  const title = note.title || 'Untitled Note';
  const content = note.content || '';

  // Excerpt first 150 chars
  const excerpt = content.length > 150 ? content.slice(0, 150) + '...' : content;

  card.innerHTML = `
    <div class="note-card-top">
      <span class="badge badge-topic">${topic}</span>
      <div class="note-card-actions">
        <button class="btn-icon-sm btn-edit-note" title="Edit Note">✏️</button>
        <button class="btn-icon-sm btn-delete-note" title="Delete Note">🗑️</button>
      </div>
    </div>

    <div class="note-card-body">
      <h4 class="note-card-title">${title}</h4>
      <p class="note-card-content">${excerpt}</p>
    </div>

    <div class="note-card-footer">
      <div class="note-ai-buttons">
        <button class="btn-note-ai btn-ai-summary" title="Summarize with Gemini AI">
          <span>✨ Summary</span>
        </button>
        <button class="btn-note-ai btn-ai-cards" title="Generate Spaced Repetition Flashcards">
          <span>🗂️ Flashcards</span>
        </button>
        <button class="btn-note-ai btn-ai-quiz" title="Generate Self-Assessment Quiz">
          <span>❓ Quiz</span>
        </button>
      </div>
    </div>
  `;

  card.querySelector('.btn-edit-note').addEventListener('click', () => onEdit && onEdit(note));
  card.querySelector('.btn-delete-note').addEventListener('click', () => onDelete && onDelete(note.id, note.title));
  card.querySelector('.btn-ai-summary').addEventListener('click', () => onSummarize && onSummarize(note));
  card.querySelector('.btn-ai-cards').addEventListener('click', () => onFlashcards && onFlashcards(note));
  card.querySelector('.btn-ai-quiz').addEventListener('click', () => onQuiz && onQuiz(note));

  return card;
}
