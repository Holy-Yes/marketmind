"""
MarketMind — FastAPI Application Entry Point
Hubverse Multi-Level Defence Matrix v8.0
Run from the backend/ directory: uvicorn main:app --reload --port 8000
"""
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from security import add_security_middleware, limiter
from routers.auth_router import router as auth_router
from routers.campaigns import router as campaigns_router
from routers.instagram import router as instagram_router
from routers.pitch import router as pitch_router
from routers.competitor import router as competitor_router
from routers.leads import router as leads_router
from routers.simulator import router as simulator_router
from routers.intelligence import router as intelligence_router
from routers.outcome_memory import router as memory_router
from routers.images import router as images_router
from routers.products import router as products_router

app = FastAPI(
    title="MarketMind API",
    description="Generative AI Platform for Sales & Marketing Intelligence — Powered by Gemini, Groq & watsonx",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Apply security middleware (CORS, honeypot, threat detection, security headers)
add_security_middleware(app)

# Rate limiter state
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please slow down and try again shortly."}
    )


# Register all routers
app.include_router(auth_router)
app.include_router(campaigns_router)
app.include_router(instagram_router)
app.include_router(pitch_router)
app.include_router(competitor_router)
app.include_router(leads_router)
app.include_router(simulator_router)
app.include_router(intelligence_router)
app.include_router(memory_router)
app.include_router(images_router)
app.include_router(products_router)


@app.get("/")
async def root():
    return {
        "platform": "MarketMind Generative AI",
        "version": "4.0.0",
        "status": "operational",
        "modules": [
            "Campaign & Content Generation",
            "Instagram Post & Reel Generation",
            "Sales Pitch & Cold Email",
            "Competitor Intelligence",
            "Lead Scoring & Intelligence",
            "Sales Practice Simulator",
            "Business Intelligence & Weekly Brief",
        ],
        "security": "Hubverse MLDM v8.0 Active",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    print("\n🚀 [DEBUG] Starting MarketMind Backend (Reload Disabled for Stability)...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
