"""
Simple in-memory rate limiter middleware.
Good enough for a hackathon MVP on a single backend instance.
For production scale, swap this for Redis-based limiting.
"""
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict

# IP -> list of request timestamps
_requests: dict[str, list[float]] = defaultdict(list)

MAX_REQUESTS = 100      # per window
WINDOW_SECONDS = 60     # 1 minute window

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for static files
        if request.url.path.startswith("/uploads"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        # Clean old timestamps outside the window
        _requests[client_ip] = [t for t in _requests[client_ip] if now - t < WINDOW_SECONDS]

        if len(_requests[client_ip]) >= MAX_REQUESTS:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down and try again shortly."}
            )

        _requests[client_ip].append(now)
        return await call_next(request)
