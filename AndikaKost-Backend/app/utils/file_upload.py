import secrets
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import validation_error

_ALLOWED_TYPES: dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "application/pdf": ".pdf",
}


def _ensure_upload_dir() -> Path:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir.resolve()


def _safe_prefix(prefix: str) -> str:
    cleaned = "".join(ch if ch.isalnum() or ch in {"_", "-"} else "_" for ch in prefix)
    return cleaned.strip("_") or "file"


def save_upload(file: UploadFile | None, *, prefix: str) -> str:
    if file is None:
        raise validation_error("File is required")

    content_type = (file.content_type or "").split(";")[0].strip().lower()
    if content_type not in _ALLOWED_TYPES:
        raise validation_error(
            "Unsupported file type",
            detail={"allowed": sorted(_ALLOWED_TYPES.keys()), "received": content_type},
        )

    max_bytes = settings.max_upload_mb * 1024 * 1024
    data = file.file.read(max_bytes + 1)

    if not data:
        raise validation_error("File is empty")

    if len(data) > max_bytes:
        raise validation_error("File too large", detail={"max_mb": settings.max_upload_mb})

    upload_dir = _ensure_upload_dir()
    safe_name = f"{_safe_prefix(prefix)}_{secrets.token_hex(8)}{_ALLOWED_TYPES[content_type]}"
    path = (upload_dir / safe_name).resolve()

    # Guard against path traversal and accidental writes outside upload dir.
    if path.parent != upload_dir:
        raise validation_error("Invalid upload path")

    with open(path, "wb") as saved_file:
        saved_file.write(data)

    return f"/uploads/{safe_name}"
