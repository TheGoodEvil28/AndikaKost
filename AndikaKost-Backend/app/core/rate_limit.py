from collections import defaultdict, deque
from threading import Lock
import time

from fastapi import Request, status

from app.core.config import settings
from app.core.exceptions import AppError


# In-memory limiter; suitable for single-process deployments.
_RATE_BUCKETS: dict[tuple[str, str], deque[float]] = defaultdict(deque)
_RATE_LOCK = Lock()


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
        if ip:
            return ip

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


def enforce_rate_limit(*, key: str, client_id: str, limit: int, window_seconds: int) -> None:
    now = time.time()
    bucket_key = (key, client_id)

    with _RATE_LOCK:
        bucket = _RATE_BUCKETS[bucket_key]
        cutoff = now - window_seconds

        while bucket and bucket[0] <= cutoff:
            bucket.popleft()

        if len(bucket) >= limit:
            retry_after = max(1, int(window_seconds - (now - bucket[0])) + 1)
            raise AppError(
                code="RATE_LIMITED",
                message="Too many upload requests from this IP. Request blocked.",
                detail={
                    "limit": limit,
                    "window_seconds": window_seconds,
                    "retry_after_seconds": retry_after,
                    "action": "block/challenge",
                },
                http_status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        bucket.append(now)


def enforce_upload_rate_limit(request: Request) -> None:
    client_ip = get_client_ip(request)
    enforce_rate_limit(
        key="upload",
        client_id=client_ip,
        limit=settings.upload_rate_limit_per_minute,
        window_seconds=settings.upload_rate_limit_window_seconds,
    )
