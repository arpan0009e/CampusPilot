import chatService from '../services/chatService.js';
import authContext from '../context/AuthContext.js';
import { ChatWindow } from '../components/chat/ChatWindow.js';
import { ChatInputController } from '../components/chat/ChatInput.js';
import { Toast } from '../components/common/ErrorMessage.js';

/**
 * Chat Page Controller
 */
export class ChatPageController {
  constructor() {
    this.chatWindow = null;
    this.chatInput = null;
    this.history = []; // [{ role: 'user' | 'assistant', content: string }]
    this.sessionId = 'session-' + Date.now();
    this.init();
  }

  init() {
    this.chatWindow = new ChatWindow({
      containerId: 'chat-messages-container',
      onSendFollowup: (promptText) => this.sendUserMessage(promptText),
    });

    this.chatInput = new ChatInputController({
      textareaId: 'chat-input-textarea',
      submitBtnId: 'chat-send-btn',
      onSend: (text) => this.sendUserMessage(text),
    });

    const clearBtn = document.getElementById('chat-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.history.length === 0) return;
        if (confirm('Clear current conversation history?')) {
          this.history = [];
          this.sessionId = 'session-' + Date.now();
          this.chatWindow.renderStarterView((p) => this.sendUserMessage(p));
          Toast.info('Conversation cleared');
        }
      });
    }

    this.updateStatusBadge();
  }

  async updateStatusBadge() {
    const statusPill = document.getElementById('chat-engine-status');
    if (!statusPill) return;

    try {
      const res = await chatService.getStatus();
      if (res.mode === 'live_gemini') {
        statusPill.innerHTML = `🟢 Live Gemini (${res.gemini_model || 'gemini-1.5-flash'})`;
        statusPill.className = 'status-pill online';
      } else {
        statusPill.innerHTML = `🟡 Offline Mock Mode`;
        statusPill.className = 'status-pill offline';
      }
    } catch {
      statusPill.innerHTML = `🔴 Server Offline`;
      statusPill.className = 'status-pill offline';
    }
  }

  onPageActivated() {
    this.updateStatusBadge();

    // Check if query was passed in hash e.g. #chat?q=something
    const hash = window.location.hash;
    if (hash.includes('?q=')) {
      const parts = hash.split('?q=');
      if (parts[1]) {
        const query = decodeURIComponent(parts[1].split('&')[0]);
        // Clean hash without reload
        history.replaceState(null, '', '#chat');
        if (query) {
          setTimeout(() => this.sendUserMessage(query), 100);
          return;
        }
      }
    }

    if (this.history.length === 0) {
      this.chatWindow.renderStarterView((p) => this.sendUserMessage(p));
    }
  }

  async sendUserMessage(text) {
    if (!text || !text.trim()) return;
    const userText = text.trim();

    // 1. Display user message
    this.chatWindow.appendMessage({
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    });

    // 2. Disable input and show typing spinner
    this.chatInput.setDisabled(true);
    this.chatWindow.showTypingIndicator();

    // Student context
    const user = authContext.user;
    const context = user
      ? `Student: ${user.name} | Dept: ${user.department || 'CS'} | Sem: ${user.semester || '6'}`
      : null;

    try {
      const res = await chatService.sendMessage({
        message: userText,
        history: this.history,
        context,
        session_id: this.sessionId,
      });

      this.chatWindow.hideTypingIndicator();

      // Append assistant message
      this.chatWindow.appendMessage({
        role: 'assistant',
        content: res.response,
        timestamp: res.timestamp || new Date().toISOString(),
        followups: res.suggested_followups || [],
      });

      // Update multi-turn history
      this.history.push({ role: 'user', content: userText });
      this.history.push({ role: 'assistant', content: res.response });
    } catch (err) {
      this.chatWindow.hideTypingIndicator();
      this.chatWindow.appendMessage({
        role: 'assistant',
        content: `⚠️ **Unable to complete request:** ${err.message || 'Please verify that the backend server is running.'}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      this.chatInput.setDisabled(false);
    }
  }
}

export let chatController = null;
export function initChatPage() {
  if (!chatController) {
    chatController = new ChatPageController();
  }
  chatController.onPageActivated();
}
