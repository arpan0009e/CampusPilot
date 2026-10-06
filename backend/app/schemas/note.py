"""
Note Schemas with AI Integration for CampusPilot
Author: Ankita (AI Integration) & Backend Team
"""

from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# Core Note Models
# ==========================================

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title of the lecture or study note")
    content: str = Field(..., min_length=1, description="Body content of the note (supports markdown)")
    subject: Optional[str] = Field(default=None, description="Optional subject or category")
    tags: List[str] = Field(default_factory=list, description="Categorization tags")


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    tags: Optional[List[str]] = None


class NoteResponse(NoteBase):
    id: str = Field(..., description="Unique note identifier")
    user_id: str = Field(..., description="Owner student identifier")
    ai_summary: Optional[str] = Field(default=None, description="Cached AI-generated summary if available")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# AI-Related Note Schemas (AI Integration)
# ==========================================

class StudyFlashcard(BaseModel):
    """An AI-generated study flashcard with front question and back answer."""
    id: int = Field(default=1, description="Card index")
    front_question: str = Field(..., description="Concept question or prompt")
    back_answer: str = Field(..., description="Concise, clear answer or explanation")
    concept: Optional[str] = Field(default=None, description="Key concept or formula tested")


class QuizQuestion(BaseModel):
    """An AI-generated multiple-choice self-test question."""
    id: int = Field(default=1, description="Question number")
    question: str = Field(..., description="Test question text")
    options: List[str] = Field(..., description="4 candidate answers (A, B, C, D)")
    correct_option_index: int = Field(..., ge=0, le=3, description="Index of correct option (0-3)")
    explanation: str = Field(..., description="Explanation of why this option is correct")


class NoteAISummarizeRequest(BaseModel):
    """Request payload to summarize notes with Gemini AI."""
    content: str = Field(..., min_length=10, description="Note body text to analyze and summarize")
    title: Optional[str] = Field(default=None, description="Optional note title for context")
    subject: Optional[str] = Field(default=None, description="Subject area")
    summary_length: Literal["short", "medium", "detailed"] = Field(
        default="medium", description="Desired length of summary"
    )
    format_type: Literal["bullet_points", "paragraph", "executive"] = Field(
        default="bullet_points", description="Desired presentation format"
    )


class NoteAISummarizeResponse(BaseModel):
    """AI-generated summary and study highlights."""
    summary: str = Field(..., description="Main executive summary")
    key_takeaways: List[str] = Field(default_factory=list, description="Top 3-6 essential bullet points")
    high_yield_exam_points: List[str] = Field(
        default_factory=list, description="High-probability topics frequently asked in exams"
    )
    suggested_tags: List[str] = Field(default_factory=list, description="Suggested categorizing tags")
    suggested_title: Optional[str] = Field(default=None, description="Suggested better/refined title")


class NoteAIFlashcardsRequest(BaseModel):
    """Request payload to generate flashcards from note content."""
    content: str = Field(..., min_length=20, description="Source notes content")
    card_count: int = Field(default=5, ge=1, le=15, description="Number of flashcards to generate")
    focus_topic: Optional[str] = Field(default=None, description="Optional subtopic to prioritize")


class NoteAIFlashcardsResponse(BaseModel):
    """Response containing AI-generated flashcards."""
    note_topic: Optional[str] = None
    flashcards: List[StudyFlashcard] = Field(default_factory=list)


class NoteAIQuizRequest(BaseModel):
    """Request payload to generate a self-assessment quiz."""
    content: str = Field(..., min_length=20, description="Source notes content")
    question_count: int = Field(default=3, ge=1, le=10, description="Number of quiz questions")


class NoteAIQuizResponse(BaseModel):
    """Response containing AI-generated quiz questions."""
    note_topic: Optional[str] = None
    questions: List[QuizQuestion] = Field(default_factory=list)
