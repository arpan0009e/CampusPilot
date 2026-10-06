from fastapi import FastAPI

from backend.app.routers.auth import router as auth_router


app = FastAPI(
    title="CampusPilot",
)


app.include_router(auth_router)