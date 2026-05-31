from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "AndikaKost"
    environment: str = "dev"
    frontend_origins: str = "http://localhost:5173"
    # Backward compatibility for existing .env files that still use FRONTEND_ORIGIN.
    frontend_origin: str | None = None

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24

    seed_admin_email: str = "admin@andika-kost.local"
    seed_admin_password: str = "ChangeMe123!"
    seed_admin_full_name: str = "Admin"

    database_url: str

    upload_dir: str = "uploads"
    max_upload_mb: int = 10

    @property
    def frontend_origin_list(self) -> list[str]:
        origins = [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]
        if self.frontend_origin and self.frontend_origin.strip():
            origins.append(self.frontend_origin.strip())
        return list(dict.fromkeys(origins))


settings = Settings()
