from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routers.auth import router as auth_router
from backend.app.routers.tasks import router as tasks_router
from backend.app.routers.notes import router as notes_router
from backend.app.routers.reminders import router as reminders_router
from backend.app.routers.chat import router as chat_router



app = FastAPI(
    title="CampusPilot",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(notes_router)
app.include_router(reminders_router)
app.include_router(chat_router)