/**
 * Dashboard AI Academic Suggestion Widget
 */
export function createAISuggestionWidget({ onAskAI = null, onBreakdownTask = null }) {
  const container = document.createElement('div');
  container.className = 'dashboard-section-card ai-glow-card';

  const tips = [
    'Use active recall flashcards right after reading lecture slides to boost retention by 50%.',
    'Divide complex engineering assignments into 25-minute Pomodoro sprints.',
    'Test edge cases early when writing code to prevent last-minute debugging stress.',
    'Summarize long reading material into high-yield exam bullet points.',
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  container.innerHTML = `
    <div class="ai-widget-header">
      <div class="ai-badge-row">
        <span class="badge badge-ai">✨ CAMPUSPILOT AI</span>
        <span class="ai-status-indicator" id="dash-ai-status">Checking AI status...</span>
      </div>
      <h3 class="ai-widget-title">Smart Academic Recommendation</h3>
      <p class="ai-widget-text">${randomTip}</p>
    </div>

    <div class="ai-widget-actions">
      <div class="ai-quick-input-group">
        <input
          type="text"
          id="dash-ai-quick-query"
          class="form-control"
          placeholder="Ask AI anything (e.g., Explain Process Synchronization)..."
        />
        <button class="btn btn-ai" id="dash-ai-submit-btn">
          <span>Ask AI</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>

      <div class="ai-suggestion-tags">
        <button class="chip chip-suggestion" data-prompt="Break down my upcoming assignment into milestones">
          📋 Break Down Assignment
        </button>
        <button class="chip chip-suggestion" data-prompt="Generate a 3-question practice quiz on my recent notes">
          📝 Quick Quiz
        </button>
        <button class="chip chip-suggestion" data-prompt="Explain Semaphores vs Mutex with a practical example">
          💡 Clarify OS Concept
        </button>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#dash-ai-quick-query');
  const submitBtn = container.querySelector('#dash-ai-submit-btn');

  const triggerAsk = (text) => {
    if (!text || !text.trim()) return;
    if (onAskAI) {
      onAskAI(text.trim());
    } else {
      window.location.hash = `#chat?q=${encodeURIComponent(text.trim())}`;
    }
  };

  submitBtn.addEventListener('click', () => {
    triggerAsk(inputEl.value);
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerAsk(inputEl.value);
    }
  });

  container.querySelectorAll('.chip-suggestion').forEach((chip) => {
    chip.addEventListener('click', () => {
      triggerAsk(chip.dataset.prompt);
    });
  });

  return container;
}
