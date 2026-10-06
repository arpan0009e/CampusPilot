"""
Chat and AI Academic Assistant Service
Author: Ankita (AI Integration)
Integrates Google Gemini API (gemini-3.8-flash) for CampusPilot
"""

import json
import logging
import re
from datetime import datetime
from typing import Any, Dict, List, Optional

from google import genai
from google.genai import types

from app.config import settings
from app.schemas.chat import (
    AcademicDoubtRequest,
    AcademicDoubtResponse,
    ChatMessage,
    ChatRequest,
    ChatResponse,
)
from app.schemas.note import (
    NoteAIFlashcardsRequest,
    NoteAIFlashcardsResponse,
    NoteAIQuizRequest,
    NoteAIQuizResponse,
    NoteAISummarizeRequest,
    NoteAISummarizeResponse,
    QuizQuestion,
    StudyFlashcard,
)
from app.schemas.task import (
    SubtaskSuggestion,
    TaskAIBreakdownRequest,
    TaskAIBreakdownResponse,
    TaskAISuggestionRequest,
    TaskAISuggestionResponse,
    TaskPriority,
)

logger = logging.getLogger(__name__)

CAMPUSPILOT_SYSTEM_INSTRUCTION = """
You are CampusPilot, a smart, encouraging, and academically rigorous AI assistant for college students.
Your mission is to help students excel academically, organize their study schedules, understand complex coursework,
prepare effectively for examinations, and manage academic stress.

Guidelines:
1. Always be supportive, practical, structured, and concise.
2. Use markdown formatting (headings, bullet points, code blocks) to make information digestible.
3. When explaining concepts, start with an intuitive real-world analogy, then the core theoretical definition, followed by examples.
4. When helping with tasks or study plans, give realistic time allocations and encourage active recall and spaced repetition.
5. If the student asks non-academic questions, politely redirect them back to their academic goals and productivity.
"""


class ChatService:
    """Service encapsulating all Gemini AI capabilities for CampusPilot."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-3.8-flash"
        self._client: Optional[genai.Client] = None

    def _get_client(self) -> Optional[genai.Client]:
        """Lazy initialization of the Google GenAI client."""
        if self._client is None and self.api_key:
            try:
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")
                return None
        return self._client

    def is_configured(self) -> bool:
        """Check whether the Gemini API key is configured."""
        return bool(self.api_key and self.api_key.strip() and self.api_key != "your_gemini_api_key_here")

    # =========================================================================
    # 1. Main Conversational Chat Assistant ("Ask CampusPilot")
    # =========================================================================

    async def generate_chat_response(self, request: ChatRequest) -> ChatResponse:
        """Generate a contextual conversational response for the student."""
        client = self._get_client()

        # Offline / Unconfigured fallback for smooth local testing
        if not client or not self.is_configured():
            return self._mock_chat_response(request)

        try:
            # Build conversation contents
            contents = []

            # Include student context if provided (e.g. current deadlines, subjects)
            context_prefix = ""
            if request.context:
                context_prefix = f"[Student Context & Dashboard Data: {request.context}]\n\n"

            # Append historical messages
            if request.history:
                for msg in request.history[-8:]:  # Keep recent context window
                    role = "user" if msg.role == "user" else "model"
                    contents.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=msg.content)]
                        )
                    )

            # Append current user prompt
            user_prompt = f"{context_prefix}{request.message}"
            contents.append(
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=user_prompt)]
                )
            )

            # Call Gemini
            config = types.GenerateContentConfig(
                system_instruction=CAMPUSPILOT_SYSTEM_INSTRUCTION,
                temperature=0.7,
                max_output_tokens=1200,
            )

            response = client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=config,
            )

            response_text = response.text or "I'm here to help! Could you please clarify your question?"

            # Generate smart follow-up suggestions
            followups = self._extract_or_generate_followups(request.message, response_text)

            return ChatResponse(
                response=response_text,
                session_id=request.session_id,
                timestamp=datetime.utcnow(),
                suggested_followups=followups,
            )

        except Exception as e:
            logger.error(f"Error in Gemini chat: {e}", exc_info=True)
            return ChatResponse(
                response=f"CampusPilot AI temporarily encountered an issue: {str(e)}. Please check your API key configuration.",
                session_id=request.session_id,
                timestamp=datetime.utcnow(),
                suggested_followups=["How do I manage my study schedule?", "Can you explain database indexing?"],
            )

    # =========================================================================
    # 2. AI Task Suggestions & Breakdown
    # =========================================================================

    async def suggest_task_breakdown(self, request: TaskAISuggestionRequest) -> TaskAISuggestionResponse:
        """Break down a student assignment into actionable steps with priority & time estimates."""
        client = self._get_client()

        if not client or not self.is_configured():
            return self._mock_task_suggestions(request)

        prompt = f"""
Analyze this academic assignment and return a valid JSON object:
Task Title: "{request.title}"
Description: "{request.description or 'None provided'}"
Subject: "{request.subject or 'General'}"
Due Date: "{request.due_date.isoformat() if request.due_date else 'Not specified'}"
Available Daily Hours: {request.available_hours_per_day}

Return JSON with exactly this structure:
{{
  "suggested_priority": "high" | "medium" | "low",
  "priority_reason": "string explaining why this priority fits",
  "estimated_total_minutes": integer,
  "subtasks": [
    {{
      "title": "string",
      "description": "string",
      "estimated_minutes": integer,
      "order": integer
    }}
  ],
  "study_tips": ["string", "string"],
  "pitfalls_to_avoid": ["string", "string"]
}}
"""
        try:
            config = types.GenerateContentConfig(
                system_instruction="You are an expert academic planner. You output strictly valid JSON.",
                temperature=0.3,
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            data = json.loads(response.text)

            # Map priority
            p_val = data.get("suggested_priority", "medium").lower()
            priority = TaskPriority.HIGH if "high" in p_val else (TaskPriority.LOW if "low" in p_val else TaskPriority.MEDIUM)

            subtasks = [
                SubtaskSuggestion(
                    title=st.get("title", f"Step {i+1}"),
                    description=st.get("description", ""),
                    estimated_minutes=int(st.get("estimated_minutes", 30)),
                    order=int(st.get("order", i+1)),
                )
                for i, st in enumerate(data.get("subtasks", []))
            ]

            return TaskAISuggestionResponse(
                suggested_priority=priority,
                priority_reason=data.get("priority_reason", "Recommended based on coursework scope."),
                estimated_total_minutes=int(data.get("estimated_total_minutes", 120)),
                subtasks=subtasks or self._default_subtasks(request.title),
                study_tips=data.get("study_tips", ["Start with the hardest concept first.", "Review notes before writing."]),
                pitfalls_to_avoid=data.get("pitfalls_to_avoid", ["Procrastinating until the deadline night."]),
            )
        except Exception as e:
            logger.error(f"Error in task suggestions: {e}")
            return self._mock_task_suggestions(request)

    async def quick_task_breakdown(self, request: TaskAIBreakdownRequest) -> TaskAIBreakdownResponse:
        """Quick milestone breakdown for an assignment."""
        suggestion_req = TaskAISuggestionRequest(
            title=request.title,
            description=request.description
        )
        res = await self.suggest_task_breakdown(suggestion_req)
        steps = res.subtasks[:request.target_steps] if request.target_steps else res.subtasks
        return TaskAIBreakdownResponse(
            task_title=request.title,
            steps=steps,
            recommended_break_strategy="25 min focused study + 5 min break (Pomodoro)"
        )

    # =========================================================================
    # 3. AI Note Summarization & Key Takeaways
    # =========================================================================

    async def summarize_note(self, request: NoteAISummarizeRequest) -> NoteAISummarizeResponse:
        """Generate structured summaries, exam highlights, and tags for student notes."""
        client = self._get_client()

        if not client or not self.is_configured():
            return self._mock_note_summary(request)

        prompt = f"""
Analyze and summarize the following student study notes into a valid JSON object:
Note Title: "{request.title or 'Untitled Note'}"
Subject: "{request.subject or 'General'}"
Summary Length: "{request.summary_length}"
Format Preference: "{request.format_type}"

Notes Content:
\"\"\"
{request.content}
\"\"\"

Return strictly valid JSON with this schema:
{{
  "summary": "Clear, comprehensive summary matching the requested length and format",
  "key_takeaways": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "high_yield_exam_points": ["Likely exam topic 1", "Likely exam topic 2"],
  "suggested_tags": ["tag1", "tag2", "tag3"],
  "suggested_title": "Refined or concise title for these notes"
}}
"""
        try:
            config = types.GenerateContentConfig(
                system_instruction="You are an expert academic tutor summarizing lecture and textbook material. Output strict JSON only.",
                temperature=0.3,
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            data = json.loads(response.text)

            return NoteAISummarizeResponse(
                summary=data.get("summary", "Summary of the provided notes."),
                key_takeaways=data.get("key_takeaways", []),
                high_yield_exam_points=data.get("high_yield_exam_points", []),
                suggested_tags=data.get("suggested_tags", ["study-notes"]),
                suggested_title=data.get("suggested_title", request.title or "Study Notes Summary"),
            )
        except Exception as e:
            logger.error(f"Error in note summarization: {e}")
            return self._mock_note_summary(request)

    # =========================================================================
    # 4. Note Flashcards & Self-Test Quiz Generation
    # =========================================================================

    async def generate_flashcards(self, request: NoteAIFlashcardsRequest) -> NoteAIFlashcardsResponse:
        """Create Q&A active recall flashcards from notes."""
        client = self._get_client()

        if not client or not self.is_configured():
            return self._mock_flashcards(request)

        prompt = f"""
Generate {request.card_count} high-yield study flashcards from these notes.
Return strictly valid JSON:
{{
  "note_topic": "Topic Name",
  "flashcards": [
    {{
      "id": 1,
      "front_question": "Concise prompt or question",
      "back_answer": "Accurate, clear answer",
      "concept": "Concept name"
    }}
  ]
}}

Content:
\"\"\"
{request.content}
\"\"\"
"""
        try:
            config = types.GenerateContentConfig(
                temperature=0.3,
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            data = json.loads(response.text)
            cards = [
                StudyFlashcard(
                    id=item.get("id", i + 1),
                    front_question=item.get("front_question", ""),
                    back_answer=item.get("back_answer", ""),
                    concept=item.get("concept", None),
                )
                for i, item in enumerate(data.get("flashcards", []))
            ]
            return NoteAIFlashcardsResponse(
                note_topic=data.get("note_topic", "Study Review"),
                flashcards=cards,
            )
        except Exception as e:
            logger.error(f"Error generating flashcards: {e}")
            return self._mock_flashcards(request)

    async def generate_quiz(self, request: NoteAIQuizRequest) -> NoteAIQuizResponse:
        """Generate multiple choice questions with explanations from student notes."""
        client = self._get_client()

        if not client or not self.is_configured():
            return self._mock_quiz(request)

        prompt = f"""
Generate {request.question_count} multiple choice quiz questions (4 options each) from these notes.
Return strictly valid JSON:
{{
  "note_topic": "Topic Name",
  "questions": [
    {{
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_option_index": 0,
      "explanation": "Why this option is correct"
    }}
  ]
}}

Content:
\"\"\"
{request.content}
\"\"\"
"""
        try:
            config = types.GenerateContentConfig(
                temperature=0.3,
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            data = json.loads(response.text)
            questions = [
                QuizQuestion(
                    id=q.get("id", i + 1),
                    question=q.get("question", ""),
                    options=q.get("options", []),
                    correct_option_index=int(q.get("correct_option_index", 0)),
                    explanation=q.get("explanation", ""),
                )
                for i, q in enumerate(data.get("questions", []))
            ]
            return NoteAIQuizResponse(
                note_topic=data.get("note_topic", "Quiz Assessment"),
                questions=questions,
            )
        except Exception as e:
            logger.error(f"Error generating quiz: {e}")
            return self._mock_quiz(request)

    # =========================================================================
    # 5. Academic Doubt Clearing
    # =========================================================================

    async def answer_academic_doubt(self, request: AcademicDoubtRequest) -> AcademicDoubtResponse:
        """Provide detailed, structured explanation for a student doubt."""
        client = self._get_client()

        if not client or not self.is_configured():
            return AcademicDoubtResponse(
                explanation=f"Here is an explanation of '{request.question}' in {request.subject}: This concept deals with fundamental principles of the subject.",
                key_concepts=["Core Principle", "Standard Workflow", "Key Formulas/Definitions"],
                examples=["Standard application example", "Edge case demonstration"],
                recommended_study_steps=["Read the textbook chapter", "Solve 3 practice problems", "Review flashcards"],
            )

        prompt = f"""
You are an academic tutor. Explain the following student question in {request.subject} (Topic: {request.topic or 'General'}):
Question: "{request.question}"
Academic Level: {request.difficulty_level}

Return strictly valid JSON:
{{
  "explanation": "Detailed explanation with analogy, definitions, and reasoning",
  "key_concepts": ["concept 1", "concept 2", "concept 3"],
  "examples": ["example 1", "example 2"],
  "recommended_study_steps": ["step 1", "step 2", "step 3"]
}}
"""
        try:
            config = types.GenerateContentConfig(
                temperature=0.4,
                response_mime_type="application/json",
            )
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            data = json.loads(response.text)
            return AcademicDoubtResponse(
                explanation=data.get("explanation", ""),
                key_concepts=data.get("key_concepts", []),
                examples=data.get("examples", []),
                recommended_study_steps=data.get("recommended_study_steps", []),
            )
        except Exception as e:
            logger.error(f"Error answering academic doubt: {e}")
            return AcademicDoubtResponse(
                explanation=f"Unable to query Gemini API: {str(e)}",
                key_concepts=[],
                examples=[],
                recommended_study_steps=[],
            )

    # =========================================================================
    # Fallback / Mock Methods (Useful for dev without API key)
    # =========================================================================

    def _mock_chat_response(self, request: ChatRequest) -> ChatResponse:
        """Fallback response when Gemini API key is not configured."""
        q = request.message.lower()
        if "priority" in q or "today" in q:
            reply = (
                "👋 **Hello! CampusPilot AI here.**\n\n"
                "Looking at your schedule, I suggest tackling your **High Priority** items first:\n"
                "1. **Complete DB assignment** (Due tomorrow)\n"
                "2. **Submit project report** (Due Friday)\n"
                "3. **Study Operating Systems** (Review process synchronization)\n\n"
                "💡 *Tip: Work in 25-minute Pomodoro sessions to stay focused!*"
            )
        elif "explain" in q or "what is" in q:
            reply = (
                f"### Understanding '{request.message}'\n\n"
                "To master this concept effectively:\n"
                "- **Core Idea**: Focus on the underlying definition and why it is needed.\n"
                "- **Key Component**: Identify the inputs, process, and outputs.\n"
                "- **Real-world Analogy**: Think of it like a coordinated queue in a busy cafeteria.\n\n"
                "*Note: Connect your Gemini API Key in `.env` to unlock deep AI reasoning!*"
            )
        else:
            reply = (
                f"👋 **Hi student!** I'm your **CampusPilot Academic Assistant**.\n\n"
                f"I received your question: *'{request.message}'*.\n\n"
                "I can help you with:\n"
                "- 📚 **Explaining tricky concepts** (Operating Systems, DBMS, Math, etc.)\n"
                "- ⏱️ **Breaking down large assignments** into daily milestones\n"
                "- 📝 **Summarizing lecture notes** and generating flashcards\n"
                "- 🎯 **Prioritizing your daily tasks** before deadlines\n\n"
                "*To activate live Gemini responses, configure `GEMINI_API_KEY` in `backend/.env`.*"
            )

        return ChatResponse(
            response=reply,
            session_id=request.session_id,
            timestamp=datetime.utcnow(),
            suggested_followups=[
                "How should I prioritize today's tasks?",
                "Can you break down my DB assignment into steps?",
                "Give me 3 active recall study techniques."
            ],
        )

    def _mock_task_suggestions(self, request: TaskAISuggestionRequest) -> TaskAISuggestionResponse:
        return TaskAISuggestionResponse(
            suggested_priority=TaskPriority.HIGH if "assignment" in request.title.lower() or "exam" in request.title.lower() else TaskPriority.MEDIUM,
            priority_reason="High cognitive load and near deadline detected.",
            estimated_total_minutes=120,
            subtasks=self._default_subtasks(request.title),
            study_tips=[
                "Review syllabus guidelines before beginning.",
                "Dedicate an uninterrupted 50-minute block for the core implementation.",
                "Test edge cases before finalizing submission."
            ],
            pitfalls_to_avoid=[
                "Leaving documentation/formatting until the last 15 minutes.",
                "Not reviewing submission guidelines."
            ],
        )

    def _default_subtasks(self, title: str) -> List[SubtaskSuggestion]:
        return [
            SubtaskSuggestion(
                title=f"Review requirements & materials for '{title}'",
                description="Read through problem statement, lecture slides, and rubric.",
                estimated_minutes=20,
                order=1,
            ),
            SubtaskSuggestion(
                title="Draft outline and core solution",
                description="Work on main problems or code implementation.",
                estimated_minutes=60,
                order=2,
            ),
            SubtaskSuggestion(
                title="Verification and error checking",
                description="Double-check calculations, test runs, or citations.",
                estimated_minutes=25,
                order=3,
            ),
            SubtaskSuggestion(
                title="Final review & submit",
                description="Package final files and upload before deadline.",
                estimated_minutes=15,
                order=4,
            ),
        ]

    def _mock_note_summary(self, request: NoteAISummarizeRequest) -> NoteAISummarizeResponse:
        lines = [line.strip() for line in request.content.split("\n") if line.strip()]
        preview = lines[0] if lines else "Provided lecture content"
        return NoteAISummarizeResponse(
            summary=f"Summary of {request.title or 'Lecture Notes'}: {preview}. These notes discuss fundamental concepts, properties, and practical applications in the curriculum.",
            key_takeaways=[
                "Core definitions and primary theoretical frameworks.",
                "Critical relationships between components and workflows.",
                "Standard practical application methods and formulas.",
            ],
            high_yield_exam_points=[
                "Short-answer definitions on fundamental terminology.",
                "Comparison questions (trade-offs and advantages).",
            ],
            suggested_tags=["academics", request.subject or "study-notes", "exam-prep"],
            suggested_title=request.title or "Consolidated Study Notes",
        )

    def _mock_flashcards(self, request: NoteAIFlashcardsRequest) -> NoteAIFlashcardsResponse:
        return NoteAIFlashcardsResponse(
            note_topic="Study Review",
            flashcards=[
                StudyFlashcard(
                    id=1,
                    front_question="What is the primary objective of this topic?",
                    back_answer="To optimize efficiency and ensure correct conceptual execution.",
                    concept="Core Objective",
                ),
                StudyFlashcard(
                    id=2,
                    front_question="What are the key trade-offs to keep in mind?",
                    back_answer="Time complexity vs space/resource constraints.",
                    concept="Trade-offs",
                ),
            ],
        )

    def _mock_quiz(self, request: NoteAIQuizRequest) -> NoteAIQuizResponse:
        return NoteAIQuizResponse(
            note_topic="Quick Self-Test",
            questions=[
                QuizQuestion(
                    id=1,
                    question="Which approach is considered best practice when preparing for this topic?",
                    options=[
                        "Passive re-reading of slides",
                        "Active recall and milestone-based practice",
                        "Cramming the night before",
                        "Skipping foundational theory",
                    ],
                    correct_option_index=1,
                    explanation="Active recall and milestone-based practice yield the highest retention and understanding.",
                )
            ],
        )

    def _extract_or_generate_followups(self, user_msg: str, assistant_reply: str) -> List[str]:
        """Generate relevant follow-up prompts for the chat UI."""
        return [
            "Can you explain this with a practical example?",
            "How should I organize my study time for this?",
            "Create 3 practice questions on this topic."
        ]


# Singleton instance for dependency injection across routers
chat_service = ChatService()
