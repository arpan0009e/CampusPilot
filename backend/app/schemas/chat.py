"""
Chat Schemas for CampusPilot AI Academic Assistant
Author: Ankita (AI Integration)
"""

from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """Individual message in a conversation thread."""
    role: Literal["user", "assistant", "model", "system"] = Field(
        ..., description="Role of the message sender"
    )
    content: str = Field(..., min_length=1, description="Text content of the message")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Time when the message was sent"
    )


class ChatRequest(BaseModel):
    """Payload sent by the student to interact with the AI assistant."""
    message: str = Field(..., min_length=1, description="User's query or message")
    history: Optional[List[ChatMessage]] = Field(
        default_factory=list, description="Previous messages in the conversation for multi-turn context"
    )
    context: Optional[str] = Field(
        default=None,
        description="Optional student context (e.g., current subject, pending tasks, upcoming deadlines)"
    )
    session_id: Optional[str] = Field(
        default=None, description="Optional session or conversation ID"
    )


class ChatResponse(BaseModel):
    """AI Assistant response returned to the student."""
    response: str = Field(..., description="Assistant's reply in markdown format")
    session_id: Optional[str] = Field(default=None, description="Active session ID")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Timestamp of the response"
    )
    suggested_followups: List[str] = Field(
        default_factory=list,
        description="Helpful suggested next questions or prompts for the student"
    )


class AcademicDoubtRequest(BaseModel):
    """Specialized prompt for clarifying academic topics or exam preparation."""
    subject: str = Field(..., description="Academic course or subject, e.g. Operating Systems")
    topic: Optional[str] = Field(default=None, description="Specific topic, e.g. Semaphores vs Mutexes")
    question: str = Field(..., description="The student's doubt or question")
    difficulty_level: Optional[str] = Field(
        default="college", description="Target academic level (e.g., beginner, college, advanced)"
    )


class AcademicDoubtResponse(BaseModel):
    """Structured response for academic doubts."""
    explanation: str = Field(..., description="Clear, comprehensive explanation")
    key_concepts: List[str] = Field(default_factory=list, description="Core concepts to remember")
    examples: List[str] = Field(default_factory=list, description="Practical illustrative examples")
    recommended_study_steps: List[str] = Field(
        default_factory=list, description="Suggested steps or exercises to master the concept"
    )


class ChatSession(BaseModel):
    """Schema representing a stored chat session."""
    id: Optional[str] = None
    user_id: Optional[str] = None
    title: str = Field(default="New Conversation", description="Summary title of the chat")
    messages: List[ChatMessage] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
