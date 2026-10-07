/**
 * Chat Message Bubble Component with Markdown formatting
 */

function formatMarkdown(text) {
  if (!text) return '';

  let html = text
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks ```lang ... ```
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4 class="chat-h3">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="chat-h2">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="chat-h1">$1</h2>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="chat-quote">$1</blockquote>');

  // Bullet items
  html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, '<li class="chat-li">$1</li>');

  // Numbered list items
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="chat-li-numbered">$1</li>');

  // Convert line breaks
  html = html.replace(/\n\n/g, '<br><br>');

  return html;
}

export function createMessageBubble({ role, content, timestamp, followups = [], onSelectFollowup = null }) {
  const isUser = role === 'user';
  const bubble = document.createElement('div');
  bubble.className = `chat-message-row ${isUser ? 'msg-user' : 'msg-ai'}`;

  const timeStr = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const avatar = isUser ? '👤' : '🤖';
  const senderName = isUser ? 'You' : 'CampusPilot AI Assistance';

  bubble.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble-content">
      <div class="chat-bubble-meta">
        <span class="chat-sender-name">${senderName}</span>
        <span class="chat-timestamp">${timeStr}</span>
      </div>
      <div class="chat-text-payload">${formatMarkdown(content)}</div>
    </div>
  `;

  if (!isUser && onSelectFollowup) {
    bubble.querySelectorAll('.chip-followup').forEach((chip) => {
      chip.addEventListener('click', () => {
        onSelectFollowup(chip.dataset.prompt);
      });
    });
  }

  return bubble;
}
