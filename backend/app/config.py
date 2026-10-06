from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # MongoDB configuration
    mongodb_url: str
    database_name: str = "campuspilot"

    # Application configuration
    app_name: str = "CampusPilot"
    debug: bool = True

    # JWT configuration
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Gemini AI configuration
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-3.8-flash"
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()