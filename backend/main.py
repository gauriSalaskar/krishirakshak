from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import numpy as np

from routes import auth, reports, predict, alerts, community, dashboard, profile, schemes, weather
from database import create_indexes
from middleware.rate_limit import RateLimitMiddleware

os.makedirs("uploads", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_indexes()
    print("✅ MongoDB indexes created")

    # Warmup: trigger model load + XLA compilation at startup
    try:
        from ai.predict import load_model
        model = load_model()
        dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
        model.predict(dummy, verbose=0)
        print("✅ AI model warmed up")
    except Exception as e:
        print(f"⚠️ Model warmup failed (predictions may be slow): {e}")

    print("✅ KrishiRakshak AI backend started")
    yield
    # Shutdown
    print("KrishiRakshak AI backend shutting down")

app = FastAPI(
    title="KrishiRakshak AI API",
    version="1.0.0",
    description="AI-Powered Crop Disease Detection & Outbreak Prediction Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(reports.router, tags=["Reports"])
app.include_router(predict.router, tags=["AI Prediction"])
app.include_router(alerts.router, tags=["Outbreak Alerts"])
app.include_router(community.router, tags=["Community"])
app.include_router(dashboard.router, tags=["Dashboard"])
app.include_router(profile.router, tags=["Profile"])
app.include_router(schemes.router, tags=["Kisan Yojana Schemes"])
app.include_router(weather.router, tags=["Weather"])

@app.get("/")
async def root():
    return {"message": "KrishiRakshak AI API is running", "version": "1.0.0", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "KrishiRakshak AI"}