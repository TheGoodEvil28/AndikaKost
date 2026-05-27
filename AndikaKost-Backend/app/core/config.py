from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "AndikaKost"
    environment: str = "dev"
    frontend_origin: str = "http://localhost:5173"

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24

    seed_admin_email: str = "admin@andika-kost.local"
    seed_admin_password: str = "ChangeMe123!"
    seed_admin_full_name: str = "Admin"

    database_url: str

    upload_dir: str = "uploads"
    max_upload_mb: int = 10


settings = Settings()
