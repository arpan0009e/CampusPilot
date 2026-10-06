"""
Chat Router - API Endpoints for AI Academic Assistant
Author: Ankita (AI Integration)
FastAPI Router for Gemini AI integration in CampusPilot
"""

from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.models.user import User
from backend.app.services.auth_dependency import get_current_user
from backend.app.config import settings

from backend.app.schemas.chat import (
    AcademicDoubtRequest,
    AcademicDoubtResponse,
    ChatRequest,
    ChatResponse,
)
from backend.app.schemas.note import (
    NoteAIFlashcardsRequest,
    NoteAIFlashcardsResponse,
    NoteAIQuizRequest,
    NoteAIQuizResponse,
    NoteAISummarizeRequest,
    NoteAISummarizeResponse,
)
from backend.app.schemas.task import (
    TaskAIBreakdownRequest,
    TaskAIBreakdownResponse,
    TaskAISuggestionRequest,
    TaskAISuggestionResponse,
)
from backend.app.services.chat_service import chat_service

router = APIRouter(
    prefix="/chat",
    tags=["AI Academic Assistant (Chat)"],
)


@router.post(
    "/message",
    response_model=ChatResponse,
    summary="Send a message to CampusPilot AI Academic Assistant",
    description="Student asks an academic question, study advice, or task assistance with multi-turn conversation support.",
)
async def send_chat_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Interact with the CampusPilot AI assistant.
    Accepts student prompt, prior conversation turns, and optional student context.
    """
    try:
        response = await chat_service.generate_chat_response(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI response: {str(e)}",
        )


@router.post(
    "/task-suggestions",
    response_model=TaskAISuggestionResponse,
    summary="AI Task Breakdown & Priority Suggestions",
    description="Analyzes assignment/task details, computes estimated completion time, breaks into subtasks, and suggests priority.",
)
async def get_task_suggestions(request: TaskAISuggestionRequest,
                               current_user: User = Depends(get_current_user),
                               ):
    """
    Get AI-generated suggestions, priority recommendations, and subtask milestones for a study task.
    """
    try:
        suggestions = await chat_service.suggest_task_breakdown(request)
        return suggestions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate task suggestions: {str(e)}",
        )


@router.post(
    "/task-breakdown",
    response_model=TaskAIBreakdownResponse,
    summary="Quick Task Milestone Breakdown",
    description="Generates a quick step-by-step Pomodoro-friendly milestone plan for an assignment.",
)
async def quick_task_breakdown(request: TaskAIBreakdownRequest,
                               current_user: User = Depends(get_current_user),
                               ):
    """
    Quick milestone breakdown for an assignment or project.
    """
    try:
        breakdown = await chat_service.quick_task_breakdown(request)
        return breakdown
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate task breakdown: {str(e)}",
        )


@router.post(
    "/summarize-note",
    response_model=NoteAISummarizeResponse,
    summary="AI Note Summarization & Exam Highlights",
    description="Analyzes lecture/study note content to produce a concise summary, key takeaways, and high-yield exam points.",
)
async def summarize_note(request: NoteAISummarizeRequest,
                         current_user: User = Depends(get_current_user),
                         ):
    """
    Summarize student lecture notes with key points, high-yield exam topics, and tags.
    """
    try:
        summary_res = await chat_service.summarize_note(request)
        return summary_res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to summarize notes: {str(e)}",
        )


@router.post(
    "/flashcards",
    response_model=NoteAIFlashcardsResponse,
    summary="Generate Study Flashcards",
    description="Extracts active recall flashcards with questions and answers from study note content.",
)
async def generate_flashcards(request: NoteAIFlashcardsRequest,
                              current_user: User = Depends(get_current_user),
                              ):
    """
    Generate study flashcards from notes for exam revision.
    """
    try:
        flashcards = await chat_service.generate_flashcards(request)
        return flashcards
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate flashcards: {str(e)}",
        )


@router.post(
    "/quiz",
    response_model=NoteAIQuizResponse,
    summary="Generate Self-Assessment Quiz",
    description="Generates multiple-choice quiz questions with answer keys and explanations from notes.",
)
async def generate_quiz(request: NoteAIQuizRequest,
                        current_user: User = Depends(get_current_user),
                        ):
    """
    Generate a multiple-choice practice quiz from study notes.
    """
    try:
        quiz = await chat_service.generate_quiz(request)
        return quiz
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}",
        )


@router.post(
    "/academic-doubt",
    response_model=AcademicDoubtResponse,
    summary="Ask Academic Concept Doubt",
    description="Specialized tutor answering detailed coursework doubts with analogies and study steps.",
)
async def clarify_academic_doubt(request: AcademicDoubtRequest,
                                 current_user: User = Depends(get_current_user),
                                 ):
    """
    Clarify an academic concept or doubt.
    """
    try:
        answer = await chat_service.answer_academic_doubt(request)
        return answer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to answer academic doubt: {str(e)}",
        )


@router.get(
    "/status",
    summary="Check AI Integration Health & Configuration",
    description="Returns whether Gemini API is configured and which model is active.",
)
async def check_ai_status():
    """
    Check if Gemini AI integration is configured and active.
    """
    is_configured = chat_service.is_configured()
    return {
        "status": "online",
        "service": "CampusPilot AI Academic Assistant",
        "gemini_model": chat_service.model_name,
        "api_key_configured": is_configured,
        "mode": "live_gemini" if is_configured else "offline_mock",
        "message": (
            "Gemini AI ready for production requests."
            if is_configured
            else "Running in offline fallback mode. Add GEMINI_API_KEY to .env to activate live Gemini API."
        ),
    }
