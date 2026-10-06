from fastapi import FastAPI

from backend.app.routers.auth import router as auth_router
from backend.app.routers.tasks import router as tasks_router

app = FastAPI(
    title="CampusPilot",
)


app.include_router(auth_router)
app.include_router(tasks_router)