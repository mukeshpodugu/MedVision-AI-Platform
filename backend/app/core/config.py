import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MedVision AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-medvision-key-for-jwt-tokens-change-this-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database configuration
    # By default, use SQLite local file. If database env vars are present, use them.
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "medvision_db")
    
    @property
    def DATABASE_URL(self) -> str:
        # Check if running in Docker or database URL is explicitly passed
        env_url = os.getenv("DATABASE_URL")
        if env_url:
            return env_url
        # If running inside docker compose, the host name will be "db"
        if os.getenv("DOCKER_ENV"):
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@db:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        # Fallback to local SQLite if postgres isn't running
        return f"sqlite:///./medvision.db"

    # File uploads path
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    
    # Developer details
    DEVELOPER_NAME: str = "PODUGU MUKESH"
    DEVELOPER_EMAIL: str = "mukeshpodugu123@gmail.com"
    DEVELOPER_PHONE: str = "8143999463"
    DEVELOPER_LOCATION: str = "Srikakulam"

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "scans"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "reports"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "explainability"), exist_ok=True)
