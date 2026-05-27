import os
import secrets
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import validation_error


def _ensure_upload_dir() -> Path:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def save_upload(file: UploadFile | None, *, prefix: str) -> str:
    if file is None:
        raise validation_error("File is required")
    content_type = (file.content_type or "").lower()
    allowed = {"image/png", "image/jpeg", "image/jpg", "application/pdf"}
    if content_type not in allowed:
        raise validation_error("Unsupported file type", detail={"allowed": sorted(allowed), "received": content_type})

    max_bytes = settings.max_upload_mb * 1024 * 1024
    data = file.file.read()
    if len(data) > max_bytes:
        raise validation_error("File too large", detail={"max_mb": settings.max_upload_mb})

    upload_dir = _ensure_upload_dir()
    ext = Path(file.filename or "").suffix.lower() or ".bin"
    safe_name = f"{prefix}_{secrets.token_hex(8)}{ext}"
    path = upload_dir / safe_name
    with open(path, "wb") as f:
        f.write(data)
    return f"/uploads/{safe_name}"
