"""
Task Schemas with AI Integration for CampusPilot
Author: Ankita (AI Integration) & Backend Team
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# Core Task Enums & Base Models
# ==========================================

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title of the task or assignment")
    description: Optional[str] = Field(default=None, description="Detailed task description or syllabus scope")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority level")
    due_date: Optional[datetime] = Field(default=None, description="Due date and deadline")
    status: TaskStatus = Field(default=TaskStatus.PENDING, description="Current progress status")
    subject: Optional[str] = Field(default=None, description="Associated academic subject/course")


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    status: Optional[TaskStatus] = None
    subject: Optional[str] = None


class TaskResponse(TaskBase):
    id: str = Field(..., description="Unique task identifier")
    user_id: str = Field(..., description="Owner student identifier")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# AI-Related Task Schemas (AI Integration)
# ==========================================

class SubtaskSuggestion(BaseModel):
    """An AI-recommended subtask or milestone to complete an assignment."""
    title: str = Field(..., description="Actionable subtask title")
    description: Optional[str] = Field(default=None, description="Brief instruction on how to execute this step")
    estimated_minutes: int = Field(default=30, description="Estimated time required in minutes")
    order: int = Field(default=1, description="Recommended sequence order")


class TaskAISuggestionRequest(BaseModel):
    """Request payload to get AI suggestions and optimization for a task."""
    title: str = Field(..., min_length=1, description="Title or prompt of the task/assignment")
    description: Optional[str] = Field(default=None, description="Detailed context or assignment prompt")
    subject: Optional[str] = Field(default=None, description="Course or subject name")
    due_date: Optional[datetime] = Field(default=None, description="Deadline for context-sensitive scheduling")
    available_hours_per_day: Optional[float] = Field(
        default=2.0, description="Hours the student can commit daily"
    )


class TaskAISuggestionResponse(BaseModel):
    """Comprehensive AI response providing intelligent task recommendations."""
    suggested_priority: TaskPriority = Field(..., description="AI recommended priority based on urgency & complexity")
    priority_reason: str = Field(..., description="Explanation of why this priority was suggested")
    estimated_total_minutes: int = Field(..., description="Total estimated time in minutes")
    subtasks: List[SubtaskSuggestion] = Field(
        default_factory=list, description="Step-by-step breakdown of the assignment"
    )
    study_tips: List[str] = Field(
        default_factory=list, description="Productivity and study tips tailored to this specific task"
    )
    pitfalls_to_avoid: List[str] = Field(
        default_factory=list, description="Common mistakes students make on this type of task"
    )


class TaskAIBreakdownRequest(BaseModel):
    """Lighter-weight request for quick step-by-step task breakdown."""
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    target_steps: Optional[int] = Field(default=4, ge=2, le=10, description="Preferred number of subtasks")


class TaskAIBreakdownResponse(BaseModel):
    """Response containing structured breakdown steps."""
    task_title: str
    steps: List[SubtaskSuggestion]
    recommended_break_strategy: Optional[str] = Field(
        default="Use 25-minute Pomodoro intervals with 5-minute short breaks",
        description="Recommended break and focus strategy"
    )
