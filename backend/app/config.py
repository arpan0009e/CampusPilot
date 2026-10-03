from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # MongoDB configuration
    MONGODB_URL: str
    MONGODB_DATABASE: str = "campuspilot"

    # Application configuration
    APP_NAME: str = "CampusPilot"
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
