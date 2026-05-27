from fastapi import HTTPException, status


class AppError(HTTPException):
    def __init__(self, *, code: str, message: str, detail: dict | None = None, http_status: int):
        super().__init__(
            status_code=http_status,
            detail={"error": {"code": code, "message": message, "detail": detail or {}}},
        )


def not_found(resource: str) -> AppError:
    return AppError(code="NOT_FOUND", message=f"{resource} not found", http_status=status.HTTP_404_NOT_FOUND)


def forbidden(message: str = "Forbidden") -> AppError:
    return AppError(code="FORBIDDEN", message=message, http_status=status.HTTP_403_FORBIDDEN)


def unauthorized(message: str = "Unauthorized") -> AppError:
    return AppError(code="UNAUTHORIZED", message=message, http_status=status.HTTP_401_UNAUTHORIZED)


def validation_error(message: str = "Invalid request data", detail: dict | None = None) -> AppError:
    return AppError(
        code="VALIDATION_ERROR",
        message=message,
        detail=detail,
        http_status=status.HTTP_422_UNPROCESSABLE_ENTITY,
    )
