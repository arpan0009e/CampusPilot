from fastapi import FastAPI

from backend.app.routers.auth import router as auth_router
from backend.app.routers.tasks import router as tasks_router
from backend.app.routers.notes import router as notes_router
from backend.app.routers.reminders import router as reminders_router


app = FastAPI(
    title="CampusPilot",
)


app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(notes_router)
app.include_router(reminders_router)