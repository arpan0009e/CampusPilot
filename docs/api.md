# CampusPilot API Documentation

## AI Academic Assistant & Gemini Integration (Phase 1 - MVP)
**Owner**: Ankita (AI Integration)  
**Base URL**: `/api/chat`

---

### 1. Send Message to CampusPilot AI (`POST /api/chat/message`)
Interactive student academic assistant supporting multi-turn conversations and student context (e.g. current deadlines, subjects).

**Request Body:**
```json
{
  "message": "Can you explain process synchronization in Operating Systems?",
  "history": [
    {
      "role": "user",
      "content": "Hi, I have an OS exam next week."
    },
    {
      "role": "assistant",
      "content": "Hello! I can help you prepare. Which topic would you like to review first?"
    }
  ],
  "context": "Subject: Operating Systems | Upcoming: DB Assignment tomorrow",
  "session_id": "session-101"
}
```

**Response (200 OK):**
```json
{
  "response": "### Process Synchronization in Operating Systems\n\nProcess synchronization is the coordination of execution of multiple processes...",
  "session_id": "session-101",
  "timestamp": "2026-10-04T12:00:00Z",
  "suggested_followups": [
    "What is the difference between Mutex and Semaphore?",
    "Can you give a practical Dining Philosophers example?",
    "Create 3 practice questions on this topic."
  ]
}
```

---

### 2. AI Task Suggestions & Breakdown (`POST /api/chat/task-suggestions`)
Analyzes assignments or tasks, estimates required hours, suggests priority level with reasoning, and breaks the task into actionable milestones.

**Request Body:**
```json
{
  "title": "Complete Database Assignment 2",
  "description": "Write B-Tree index queries and optimize execution plans in PostgreSQL",
  "subject": "Database Management Systems",
  "available_hours_per_day": 2.5
}
```

**Response (200 OK):**
```json
{
  "suggested_priority": "high",
  "priority_reason": "High cognitive load and near deadline detected.",
  "estimated_total_minutes": 120,
  "subtasks": [
    {
      "title": "Review requirements & materials for 'Complete Database Assignment 2'",
      "description": "Read through problem statement, lecture slides, and rubric.",
      "estimated_minutes": 20,
      "order": 1
    },
    {
      "title": "Draft outline and core solution",
      "description": "Work on main problems or code implementation.",
      "estimated_minutes": 60,
      "order": 2
    },
    {
      "title": "Verification and error checking",
      "description": "Double-check calculations, test runs, or citations.",
      "estimated_minutes": 25,
      "order": 3
    },
    {
      "title": "Final review & submit",
      "description": "Package final files and upload before deadline.",
      "estimated_minutes": 15,
      "order": 4
    }
  ],
  "study_tips": [
    "Review syllabus guidelines before beginning.",
    "Dedicate an uninterrupted 50-minute block for the core implementation.",
    "Test edge cases before finalizing submission."
  ],
  "pitfalls_to_avoid": [
    "Leaving documentation/formatting until the last 15 minutes."
  ]
}
```

---

### 3. AI Note Summarization & Exam Highlights (`POST /api/chat/summarize-note`)
Generates high-yield study summaries, top key takeaways, and likely exam topics from lecture notes.

**Request Body:**
```json
{
  "title": "CPU Scheduling Algorithms",
  "subject": "Operating Systems",
  "content": "CPU scheduling deals with the problem of deciding which of the processes in the ready queue is to be allocated the CPU...",
  "summary_length": "medium",
  "format_type": "bullet_points"
}
```

**Response (200 OK):**
```json
{
  "summary": "Summary of CPU Scheduling Algorithms: Overview of FCFS, SJF, and Round Robin scheduling policies...",
  "key_takeaways": [
    "FCFS is simple but prone to the convoy effect.",
    "SJF minimizes average waiting time but requires burst prediction.",
    "Round Robin utilizes a fixed time quantum for time-sharing."
  ],
  "high_yield_exam_points": [
    "Short-answer definitions on convoy effect.",
    "Calculation of average waiting time for Round Robin vs SJF."
  ],
  "suggested_tags": ["academics", "Operating Systems", "exam-prep"],
  "suggested_title": "CPU Scheduling Summary & Comparison"
}
```

---

### 4. Active Recall Flashcards (`POST /api/chat/flashcards`)
Extracts Q&A flashcards for spaced repetition study.

**Request Body:**
```json
{
  "content": "A semaphore is a synchronization variable providing wait() and signal() operations...",
  "card_count": 3
}
```

**Response (200 OK):**
```json
{
  "note_topic": "Process Synchronization",
  "flashcards": [
    {
      "id": 1,
      "front_question": "What operations are permitted on a semaphore?",
      "back_answer": "wait() (or P) and signal() (or V).",
      "concept": "Semaphore Operations"
    }
  ]
}
```

---

### 5. Practice Quiz Generator (`POST /api/chat/quiz`)
Generates multiple-choice self-assessment questions with explanations.

**Request Body:**
```json
{
  "content": "Deadlock conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
  "question_count": 2
}
```

---

### 6. AI Service Status (`GET /api/chat/status`)
Checks whether Gemini API is active or running in offline mock fallback mode.
