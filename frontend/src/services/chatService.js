import api from './api.js';

export const chatService = {
  /**
   * Check status of Gemini AI backend
   */
  getStatus: async () => {
    try {
      return await api.get('/chat/status');
    } catch {
      return {
        status: 'offline',
        service: 'CampusPilot AI Academic Assistant',
        gemini_model: 'offline_fallback',
        api_key_configured: false,
        mode: 'offline_mock',
        message: 'Backend AI server unreachable. Running in offline fallback mode.',
      };
    }
  },

  /**
   * Send multi-turn conversation message to CampusPilot AI
   * @param {Object} payload - { message, history: [{role, content}], context, session_id }
   */
  sendMessage: async ({ message, history = [], context = null, session_id = null }) => {
    try {
      const data = await api.post('/chat/message', {
        message,
        history,
        context,
        session_id: session_id || 'session-' + Date.now(),
      });
      return data;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        // Smart offline mock AI generator
        let reply = `### CampusPilot Academic Assistant (Offline Mode)\n\nI can help you organize your studies and clarify coursework concepts.\n\n* **Query Received:** "${message}"\n* **Next Action:** Try breaking this topic into 25-minute Pomodoro sessions and review key definitions.`;

        const q = message.toLowerCase();
        if (q.includes('synchronization') || q.includes('operating system') || q.includes('semaphore')) {
          reply = `### Process Synchronization in Operating Systems\n\nProcess synchronization is the coordination of execution of multiple processes that share a critical section of memory to ensure data consistency.\n\n#### Key Mechanisms:\n1. **Semaphores:** Integer synchronization variables manipulated via atomic \`wait()\` and \`signal()\` operations.\n2. **Mutex Locks:** Binary mutual-exclusion locks preventing concurrent critical section execution.\n3. **Monitors:** High-level language constructs encapsulating synchronization variables.\n\n> **Exam Tip:** Classical synchronization problems like *Dining Philosophers* and *Producer-Consumer* frequently appear in semester exams!`;
        } else if (q.includes('task') || q.includes('schedule') || q.includes('plan')) {
          reply = `### Recommended Study Schedule & Plan\n\nBased on your current deadlines:\n1. **High Priority Block (90 mins):** Work on immediate programming assignments.\n2. **Break (15 mins):** Step away from the screen.\n3. **Active Recall (45 mins):** Review lecture notes using self-test flashcards.\n4. **Evening Review:** Wrap up by ticking off completed tasks on your dashboard.`;
        }

        return {
          response: reply,
          session_id: session_id || 'offline-session-1',
          timestamp: new Date().toISOString(),
          suggested_followups: [
            'Break down my next assignment into milestones',
            'Generate a 3-question quiz on this topic',
            'Create active recall flashcards',
          ],
        };
      }
      throw err;
    }
  },

  /**
   * AI Task Suggestions and Milestone Breakdown
   * @param {Object} data - { title, description, subject, available_hours_per_day, due_date }
   */
  getTaskSuggestions: async (data) => {
    try {
      return await api.post('/chat/task-suggestions', data);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return {
          suggested_priority: 'high',
          priority_reason: 'Estimated effort exceeds 90 minutes; early start recommended.',
          estimated_total_minutes: 120,
          subtasks: [
            {
              title: `Review problem statement & requirements for "${data.title}"`,
              description: 'Analyze assignment prompt, rubric guidelines, and reference notes.',
              estimated_minutes: 20,
              order: 1,
            },
            {
              title: 'Draft core solution & implementation',
              description: 'Build main logic, calculations, or code prototype.',
              estimated_minutes: 60,
              order: 2,
            },
            {
              title: 'Test edge cases & verify results',
              description: 'Double check test runs, edge condition handling, and output accuracy.',
              estimated_minutes: 25,
              order: 3,
            },
            {
              title: 'Final polish and submission package',
              description: 'Format documentation, generate report PDF, and upload.',
              estimated_minutes: 15,
              order: 4,
            },
          ],
          study_tips: [
            'Work in a focused 50-minute interval with phone notifications turned off.',
            'Document assumptions as you write code or solve problems.',
            'Review rubrics before final submission.',
          ],
          pitfalls_to_avoid: [
            'Postponing testing until 15 minutes before the deadline.',
            'Skipping error boundary tests.',
          ],
        };
      }
      throw err;
    }
  },

  /**
   * Quick Task Milestone Breakdown
   * @param {Object} data - { title, description, target_steps }
   */
  quickTaskBreakdown: async (data) => {
    try {
      return await api.post('/chat/task-breakdown', data);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return {
          task_title: data.title,
          steps: [
            { title: 'Step 1: Setup workspace and gather reference materials', estimated_minutes: 15, order: 1 },
            { title: 'Step 2: Implement primary solution and code core algorithms', estimated_minutes: 45, order: 2 },
            { title: 'Step 3: Verification, testing, and debugging', estimated_minutes: 20, order: 3 },
            { title: 'Step 4: Final review, formatting, and submission', estimated_minutes: 15, order: 4 },
          ],
          recommended_break_strategy: 'Use 25-minute Pomodoro intervals with 5-minute short breaks',
        };
      }
      throw err;
    }
  },

  /**
   * Summarize notes with Gemini AI
   * @param {Object} data - { content, title, subject, summary_length, format_type }
   */
  summarizeNote: async (data) => {
    try {
      return await api.post('/chat/summarize-note', data);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return {
          summary: `Executive summary of "${data.title || 'Lecture Note'}": This topic focuses on key theoretical principles, architectural tradeoffs, and practical application in university exams.`,
          key_takeaways: [
            'Fundamental concepts require thorough conceptual understanding of core mechanisms.',
            'Trade-offs between performance and simplicity are evaluated in exam questions.',
            'Consistent practice of diagrams and algorithmic steps yields top marks.',
          ],
          high_yield_exam_points: [
            'Definitions and distinctions between standard and alternative models.',
            'Numerical or algorithmic tracing questions.',
          ],
          suggested_tags: ['academics', data.subject || 'study-prep', 'high-yield'],
          suggested_title: `${data.title || 'Study Note'} - High Yield Summary`,
        };
      }
      throw err;
    }
  },

  /**
   * Generate active recall flashcards from notes
   * @param {Object} data - { content, card_count, focus_topic }
   */
  generateFlashcards: async (data) => {
    try {
      return await api.post('/chat/flashcards', data);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return {
          note_topic: data.focus_topic || 'Academic Concept',
          flashcards: [
            {
              id: 1,
              front_question: 'What is the primary objective of this concept in system design?',
              back_answer: 'To ensure synchronization, avoid race conditions, and preserve data integrity across concurrent threads.',
              concept: 'Core Purpose',
            },
            {
              id: 2,
              front_question: 'What are the two atomic operations permitted on semaphores?',
              back_answer: 'wait() (also called P) which decrements, and signal() (also called V) which increments.',
              concept: 'Semaphore Primitives',
            },
            {
              id: 3,
              front_question: 'Why are B+ Trees favored over standard B-Trees for database index structures?',
              back_answer: 'All data records are stored in linked leaves, allowing extremely fast range sequential scans and higher branching factors in internal nodes.',
              concept: 'Database Indexing',
            },
          ],
        };
      }
      throw err;
    }
  },

  /**
   * Generate self-assessment quiz from notes
   * @param {Object} data - { content, question_count }
   */
  generateQuiz: async (data) => {
    try {
      return await api.post('/chat/quiz', data);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return {
          note_topic: 'Concept Assessment',
          questions: [
            {
              id: 1,
              question: 'Which condition is NOT required for a deadlock to occur?',
              options: [
                'Mutual Exclusion',
                'Hold and Wait',
                'Preemption Allowed',
                'Circular Wait',
              ],
              correct_option_index: 2,
              explanation: 'Deadlock requires NO preemption. If preemption is allowed, deadlocked resources can be forcibly recovered.',
            },
            {
              id: 2,
              question: 'In a counting semaphore initialized to 5, after 3 wait() and 1 signal() operations, what is its value?',
              options: ['2', '3', '4', '5'],
              correct_option_index: 1,
              explanation: 'Initial value: 5. Three wait operations: 5 - 3 = 2. One signal operation: 2 + 1 = 3.',
            },
          ],
        };
      }
      throw err;
    }
  },

  /**
   * Clarify academic concept or doubt
   * @param {Object} data - { subject, topic, question, difficulty_level }
   */
  clarifyAcademicDoubt: async (data) => {
    try {
      return await api.post('/chat/academic-doubt', data);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return {
          explanation: `In ${data.subject}, "${data.question}" is a key topic. Here is the breakdown: ${data.topic || 'the topic'} addresses how systems manage concurrency and consistency.`,
          key_concepts: ['Atomic execution', 'Critical Section Problem', 'Deadlock avoidance'],
          examples: ['Producer-Consumer problem with bounded buffer', 'Reader-Writer problem'],
          recommended_study_steps: [
            'Review the 3 requirements for critical section: Mutual Exclusion, Progress, Bounded Waiting.',
            'Solve past 3 years university exam problems on this topic.',
          ],
        };
      }
      throw err;
    }
  },
};

export default chatService;
