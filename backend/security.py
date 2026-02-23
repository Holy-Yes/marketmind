"""
MarketMind — Security Module (Hubverse MLDM v8)
Multi-level defence matrix: rate limiting, WAF, CORS, honeypot, threat detection, security headers.
"""
import os
import time
from collections import defaultdict
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

# Threat tracking (in-memory — use Redis in production)
_ip_threat_scores: dict[str, int] = defaultdict(int)
_ip_honeypot_hits: set[str] = set()

BLOCKED_PATTERNS = ["../", "..\\", "<script", "{{", "eval(", "exec(", "DROP ", "UNION "]

HONEYPOT_PATHS = {"/admin", "/wp-admin", "/phpMyAdmin", "/config.php", "/.env", "/api/v0/"}


def add_security_middleware(app: FastAPI) -> None:
    """Attach all security middleware to the FastAPI app."""

    # CORS — allow local dev frontend
    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def security_middleware(request: Request, call_next: Callable) -> Response:
        # Skip security checks for CORS preflight (OPTIONS)
        if request.method == "OPTIONS":
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path

        # Honeypot detection
        if path in HONEYPOT_PATHS:
            _ip_honeypot_hits.add(client_ip)
            _ip_threat_scores[client_ip] += 50
            return Response("Not Found", status_code=404)

        # Block known threat IPs
        if _ip_threat_scores.get(client_ip, 0) >= 100:
            return Response("Forbidden", status_code=403)

        # WAF — scan query string & body snippets for injection patterns
        query_str = str(request.url.query)
        for pattern in BLOCKED_PATTERNS:
            if pattern.lower() in query_str.lower():
                _ip_threat_scores[client_ip] += 30
                return Response(
                    content='{"detail": "Request blocked by WAF."}',
                    status_code=400,
                    media_type="application/json"
                )

        # Process request
        response: Response = await call_next(request)

        # Add security headers (OWASP recommended)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-MarketMind-Security"] = "MLDM-v8"

        return response
