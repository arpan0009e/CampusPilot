/**
 * Chat Input Component
 */
export class ChatInputController {
  constructor({ textareaId, submitBtnId, onSend }) {
    this.textarea = document.getElementById(textareaId);
    this.submitBtn = document.getElementById(submitBtnId);
    this.onSend = onSend;
    this.init();
  }

  init() {
    if (!this.textarea || !this.submitBtn) return;

    this.submitBtn.addEventListener('click', () => this.handleSend());

    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Auto resize
    this.textarea.addEventListener('input', () => {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = `${Math.min(this.textarea.scrollHeight, 140)}px`;
    });
  }

  handleSend() {
    const text = this.textarea.value.trim();
    if (!text) return;
    this.onSend(text);
    this.textarea.value = '';
    this.textarea.style.height = 'auto';
    this.textarea.focus();
  }

  setDisabled(disabled) {
    if (this.textarea) this.textarea.disabled = disabled;
    if (this.submitBtn) {
      this.submitBtn.disabled = disabled;
      if (disabled) {
        this.submitBtn.classList.add('loading');
      } else {
        this.submitBtn.classList.remove('loading');
      }
    }
  }

  setValue(val) {
    if (this.textarea) {
      this.textarea.value = val;
      this.textarea.focus();
    }
  }
}
