import { createMessageBubble } from './Message.js';

/**
 * Chat Window Controller
 */
export class ChatWindow {
  constructor({ containerId, onSendFollowup }) {
    this.container = document.getElementById(containerId);
    this.onSendFollowup = onSendFollowup;
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  appendMessage({ role, content, timestamp, followups = [] }) {
    if (!this.container) return;

    // Remove empty starter if present
    const emptyStarter = this.container.querySelector('.chat-starter-view');
    if (emptyStarter) {
      emptyStarter.remove();
    }

    const bubble = createMessageBubble({
      role,
      content,
      timestamp,
      followups,
      onSelectFollowup: this.onSendFollowup,
    });

    this.container.appendChild(bubble);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    this.hideTypingIndicator();
    const indicator = document.createElement('div');
    indicator.id = 'chat-typing-indicator';
    indicator.className = 'chat-message-row msg-ai';
    indicator.innerHTML = `
      <div class="chat-avatar">✨</div>
      <div class="chat-bubble-content">
        <div class="typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.container.appendChild(indicator);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  renderStarterView(onSelectPrompt) {
    if (!this.container) return;
    this.clear();

    const starter = document.createElement('div');
    starter.className = 'chat-starter-view';
    starter.innerHTML = `
      <div class="starter-icon">💬</div>
      <h3 class="starter-title">CampusPilot AI Assistance</h3>
      <p class="starter-desc">
        Ask questions regarding course concepts, request step-by-step milestone breakdowns for assignments, or generate active recall flashcards.
      </p>
    `;

    this.container.appendChild(starter);
  }
}
