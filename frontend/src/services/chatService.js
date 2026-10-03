import api from './api';

const DEFAULT_MESSAGES = [
  { id: '1', sender: 'ai', text: 'Hello! I am CampusPilot AI. How can I help you organize your study schedule today?' }
];

export const chatService = {
  getConversation: async () => {
    try {
      const res = await api.get('/chat');
      return res.data;
    } catch {
      const saved = localStorage.getItem('cp_chat');
      if (!saved) {
        localStorage.setItem('cp_chat', JSON.stringify(DEFAULT_MESSAGES));
        return DEFAULT_MESSAGES;
      }
      return JSON.parse(saved);
    }
  },

  sendMessage: async (userText) => {
    try {
      const res = await api.post('/chat', { message: userText });
      return res.data;
    } catch {
      const history = await chatService.getConversation();
      const userMsg = { id: Date.now().toString(), sender: 'user', text: userText };
      
      // Smart offline AI responses for testing
      let replyText = "Focus on high priority tasks due soon. Break your study time into 25-minute Pomodoro sessions.";
      if (userText.toLowerCase().includes('task') || userText.toLowerCase().includes('focus')) {
        replyText = "You have 2 pending tasks! I recommend finishing 'Complete Math Assignment #4' first.";
      } else if (userText.toLowerCase().includes('schedule') || userText.toLowerCase().includes('plan')) {
        replyText = "Here is a quick plan: 1. Math Assignment (2 hrs), 2. CS Demo prep (1.5 hrs), 3. Evening review of waves physics notes.";
      }

      const aiMsg = { id: (Date.now() + 1).toString(), sender: 'ai', text: replyText };
      const updated = [...history, userMsg, aiMsg];
      localStorage.setItem('cp_chat', JSON.stringify(updated));
      return aiMsg;
    }
  }
};
