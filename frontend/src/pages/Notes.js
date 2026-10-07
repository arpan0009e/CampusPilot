import noteService from '../services/noteService.js';
import chatService from '../services/chatService.js';
import { renderNoteList } from '../components/notes/NoteList.js';
import { NoteFormModal } from '../components/notes/NoteForm.js';
import ModalManager from '../components/common/Modal.js';
import { Toast } from '../components/common/ErrorMessage.js';

/**
 * Notes Page Controller
 */
export class NotesPageController {
  constructor() {
    this.notes = [];
    this.activeTopic = 'all';
    this.searchQuery = '';
    this.noteFormModal = null;
    this.init();
  }

  init() {
    this.noteFormModal = new NoteFormModal({
      onSubmit: async (id, noteData) => {
        if (id) {
          await noteService.updateNote(id, noteData);
          Toast.success('Note updated!');
        } else {
          await noteService.createNote(noteData);
          Toast.success('Note saved!');
        }
        await this.loadNotes();
      },
    });

    const addBtn = document.getElementById('notes-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.noteFormModal.openCreate(this.activeTopic !== 'all' ? this.activeTopic : '');
      });
    }

    const searchInput = document.getElementById('notes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.render();
      });
    }
  }

  async loadNotes() {
    const listContainer = document.getElementById('notes-list-container');
    if (listContainer) {
      listContainer.innerHTML = '<div class="loading-state"><div class="spinner-ring"></div><span>Loading study notes...</span></div>';
    }

    try {
      this.notes = await noteService.getNotes();
      this.renderTopicPills();
      this.render();
    } catch (err) {
      console.error(err);
      Toast.error('Failed to load notes.');
    }
  }

  renderTopicPills() {
    const topicsContainer = document.getElementById('notes-topic-pills');
    if (!topicsContainer) return;

    const topicsSet = new Set(['all']);
    this.notes.forEach((n) => {
      if (n.topic) topicsSet.add(n.topic);
    });

    topicsContainer.innerHTML = '';
    topicsSet.forEach((topic) => {
      const btn = document.createElement('button');
      btn.className = `chip chip-topic ${this.activeTopic === topic ? 'active' : ''}`;
      btn.textContent = topic === 'all' ? 'All Topics' : topic;
      btn.addEventListener('click', () => {
        this.activeTopic = topic;
        this.renderTopicPills();
        this.render();
      });
      topicsContainer.appendChild(btn);
    });
  }

  render() {
    const listContainer = document.getElementById('notes-list-container');
    if (!listContainer) return;

    renderNoteList({
      container: listContainer,
      notes: this.notes,
      activeTopic: this.activeTopic,
      searchQuery: this.searchQuery,
      onEdit: (note) => this.noteFormModal.openEdit(note),
      onDelete: (id, title) => this.confirmDelete(id, title),
      onSummarize: (note) => this.showAISummary(note),
      onFlashcards: (note) => this.showAIFlashcards(note),
      onQuiz: (note) => this.showAIQuiz(note),
      onCreateNew: () => this.noteFormModal.openCreate(),
    });

    const countEl = document.getElementById('notes-total-badge');
    if (countEl) {
      countEl.textContent = `${this.notes.length} notes`;
    }
  }

  confirmDelete(id, title) {
    if (confirm(`Delete note "${title}"?`)) {
      noteService
        .deleteNote(id)
        .then(() => {
          Toast.success('Note deleted');
          this.loadNotes();
        })
        .catch((err) => Toast.error(err.message || 'Failed to delete note'));
    }
  }

  // 1. AI Note Summary
  async showAISummary(note) {
    ModalManager.open('modal-note-summary');
    const contentBox = document.getElementById('note-summary-content');
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="ai-modal-loading">
          <div class="spinner-ring lg"></div>
          <p>Analyzing lecture notes & generating high-yield exam takeaways with Gemini AI...</p>
        </div>
      `;
    }

    try {
      const res = await chatService.summarizeNote({
        title: note.title,
        subject: note.topic,
        content: note.content,
        summary_length: 'medium',
        format_type: 'bullet_points',
      });

      if (contentBox) {
        contentBox.innerHTML = `
          <div class="summary-result-card">
            <div class="summary-header">
              <span class="badge badge-ai">✨ AI Exam Summary</span>
              <h4>${res.suggested_title || note.title}</h4>
              <p class="summary-text">${res.summary}</p>
            </div>

            <div class="takeaways-box">
              <h5>🎯 Key Takeaways:</h5>
              <ul>
                ${(res.key_takeaways || []).map((t) => `<li>${t}</li>`).join('')}
              </ul>
            </div>

            ${
              res.high_yield_exam_points && res.high_yield_exam_points.length > 0
                ? `
              <div class="exam-points-box">
                <h5>🔥 High-Yield Exam Highlights:</h5>
                <ul>
                  ${res.high_yield_exam_points.map((p) => `<li>${p}</li>`).join('')}
                </ul>
              </div>
            `
                : ''
            }

            <div class="tags-row">
              ${(res.suggested_tags || []).map((tag) => `<span class="badge badge-secondary badge-xs">#${tag}</span>`).join('')}
            </div>
          </div>
        `;
      }
    } catch (err) {
      if (contentBox) {
        contentBox.innerHTML = `<div class="error-banner"><p>Failed to summarize note: ${err.message}</p></div>`;
      }
    }
  }

  // 2. Active Recall Flashcards Viewer
  async showAIFlashcards(note) {
    ModalManager.open('modal-note-flashcards');
    const contentBox = document.getElementById('note-flashcards-content');
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="ai-modal-loading">
          <div class="spinner-ring lg"></div>
          <p>Extracting active recall flashcards from your notes...</p>
        </div>
      `;
    }

    try {
      const res = await chatService.generateFlashcards({
        content: note.content,
        card_count: 5,
        focus_topic: note.topic,
      });

      const cards = res.flashcards || [];
      if (cards.length === 0) {
        contentBox.innerHTML = '<p class="text-center">No flashcards could be generated from this content.</p>';
        return;
      }

      let currentIndex = 0;

      const renderCardView = () => {
        const c = cards[currentIndex];
        contentBox.innerHTML = `
          <div class="flashcards-deck-container">
            <div class="deck-progress">
              <span>Card ${currentIndex + 1} of ${cards.length}</span>
              <span class="badge badge-topic">${c.concept || note.topic}</span>
            </div>

            <div class="flip-card" id="active-flashcard">
              <div class="flip-card-inner" id="flashcard-inner">
                <div class="flip-card-front">
                  <span class="flip-hint">QUESTION (Click to flip)</span>
                  <div class="flip-content">${c.front_question}</div>
                </div>
                <div class="flip-card-back">
                  <span class="flip-hint">ANSWER (Click to flip)</span>
                  <div class="flip-content">${c.back_answer}</div>
                </div>
              </div>
            </div>

            <div class="deck-controls">
              <button class="btn btn-secondary btn-sm" id="btn-prev-card" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
              <button class="btn btn-primary btn-sm" id="btn-flip-card">🔄 Flip Card</button>
              <button class="btn btn-secondary btn-sm" id="btn-next-card" ${currentIndex === cards.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>
          </div>
        `;

        const cardEl = document.getElementById('active-flashcard');
        const flipBtn = document.getElementById('btn-flip-card');
        const toggleFlip = () => cardEl.classList.toggle('flipped');

        cardEl.addEventListener('click', toggleFlip);
        flipBtn.addEventListener('click', toggleFlip);

        document.getElementById('btn-prev-card').addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            renderCardView();
          }
        });

        document.getElementById('btn-next-card').addEventListener('click', () => {
          if (currentIndex < cards.length - 1) {
            currentIndex++;
            renderCardView();
          }
        });
      };

      renderCardView();
    } catch (err) {
      if (contentBox) {
        contentBox.innerHTML = `<div class="error-banner"><p>Failed to generate flashcards: ${err.message}</p></div>`;
      }
    }
  }

  // 3. Interactive Quiz Runner
  async showAIQuiz(note) {
    ModalManager.open('modal-note-quiz');
    const contentBox = document.getElementById('note-quiz-content');
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="ai-modal-loading">
          <div class="spinner-ring lg"></div>
          <p>Creating multiple choice assessment questions with answer explanations...</p>
        </div>
      `;
    }

    try {
      const res = await chatService.generateQuiz({
        content: note.content,
        question_count: 3,
      });

      const questions = res.questions || [];
      if (questions.length === 0) {
        contentBox.innerHTML = '<p class="text-center">No quiz questions generated.</p>';
        return;
      }

      let userAnswers = {};
      let isSubmitted = false;

      const renderQuizView = () => {
        let score = 0;
        if (isSubmitted) {
          questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct_option_index) score++;
          });
        }

        contentBox.innerHTML = `
          <div class="quiz-container">
            <div class="quiz-header">
              <span class="badge badge-ai">✨ Practice Quiz</span>
              <h4>Self-Assessment: ${note.title}</h4>
              ${
                isSubmitted
                  ? `<div class="quiz-score-badge">Your Score: <strong>${score} / ${questions.length}</strong> (${Math.round((score / questions.length) * 100)}%)</div>`
                  : ''
              }
            </div>

            <div class="quiz-questions-list">
              ${questions
                .map((q, qIdx) => {
                  return `
                    <div class="quiz-question-card ${isSubmitted ? (userAnswers[qIdx] === q.correct_option_index ? 'is-correct' : 'is-wrong') : ''}">
                      <div class="quiz-q-num">Question ${qIdx + 1}</div>
                      <h5 class="quiz-q-title">${q.question}</h5>
                      <div class="quiz-options-group">
                        ${q.options
                          .map((opt, optIdx) => {
                            const isChosen = userAnswers[qIdx] === optIdx;
                            const isCorrectOpt = q.correct_option_index === optIdx;
                            let optionClass = '';
                            if (isSubmitted) {
                              if (isCorrectOpt) optionClass = 'correct-opt';
                              else if (isChosen && !isCorrectOpt) optionClass = 'wrong-opt';
                            } else if (isChosen) {
                              optionClass = 'chosen-opt';
                            }

                            return `
                              <button
                                type="button"
                                class="quiz-option-btn ${optionClass}"
                                data-q-idx="${qIdx}"
                                data-opt-idx="${optIdx}"
                                ${isSubmitted ? 'disabled' : ''}
                              >
                                <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
                                <span class="opt-text">${opt}</span>
                              </button>
                            `;
                          })
                          .join('')}
                      </div>

                      ${
                        isSubmitted
                          ? `
                        <div class="quiz-explanation-box">
                          <strong>Explanation:</strong> ${q.explanation}
                        </div>
                      `
                          : ''
                      }
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="quiz-footer">
              ${
                !isSubmitted
                  ? `<button class="btn btn-primary" id="btn-submit-quiz">Submit Quiz Answers</button>`
                  : `<button class="btn btn-secondary" id="btn-retake-quiz">🔄 Retake Quiz</button>`
              }
            </div>
          </div>
        `;

        if (!isSubmitted) {
          contentBox.querySelectorAll('.quiz-option-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
              const qIdx = parseInt(btn.dataset.qIdx, 10);
              const optIdx = parseInt(btn.dataset.optIdx, 10);
              userAnswers[qIdx] = optIdx;
              renderQuizView();
            });
          });

          const submitBtn = document.getElementById('btn-submit-quiz');
          if (submitBtn) {
            submitBtn.addEventListener('click', () => {
              if (Object.keys(userAnswers).length < questions.length) {
                if (!confirm('You have unanswered questions. Submit anyway?')) return;
              }
              isSubmitted = true;
              renderQuizView();
            });
          }
        } else {
          const retakeBtn = document.getElementById('btn-retake-quiz');
          if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
              userAnswers = {};
              isSubmitted = false;
              renderQuizView();
            });
          }
        }
      };

      renderQuizView();
    } catch (err) {
      if (contentBox) {
        contentBox.innerHTML = `<div class="error-banner"><p>Failed to generate quiz: ${err.message}</p></div>`;
      }
    }
  }
}

export let notesController = null;
export function initNotesPage() {
  if (!notesController) {
    notesController = new NotesPageController();
  }
  notesController.loadNotes();
}
