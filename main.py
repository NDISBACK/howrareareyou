from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import UserProfile
from rarity_engine import calculate_rarity
from archetypes import determine_archetype
from insights import generate_insights
from groq_analysis import generate_ai_analysis
from future_projections import generate_future_projection

import time
import uuid
from datetime import datetime

app = FastAPI(
    title="How Rare Are You API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*", 
        "https://howrareareyou-eta.vercel.app" # Replace with your frontend URL later
        # "http://localhost:5173",
        # "https://your-vercel-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {
        "status": "online",
        "message": "How Rare Are You API is running 🚀",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze(profile: UserProfile):

    start_time = time.time()

    report_id = str(uuid.uuid4())

    generated_at = datetime.utcnow().isoformat() + "Z"

    warnings = []

    # --------------------------
    # Core Analysis
    # --------------------------

    rarity = calculate_rarity(profile)

    archetype = determine_archetype(profile)

    insights = generate_insights(profile)

    profile_data = {
        "age": profile.age,
        "country": profile.country,

        "programming": profile.programming,
        "instrument": profile.instrument,
        "gym": profile.gym,
        "reads_books": profile.reads_books,
        "builds_projects": profile.builds_projects,
        "engineering_student": profile.engineering_student,
        "entrepreneurship_interest": profile.entrepreneurship_interest,

        "rarity_score": rarity["score"],
        "percentile": rarity["percentile"],
        "matched_traits": rarity["matched_traits"],

        "archetype": archetype["name"],
        "description": archetype["description"],

        "insights": insights
    }

    # --------------------------
    # AI Personality Analysis
    # --------------------------

    try:
        ai_analysis = generate_ai_analysis(profile_data)

    except Exception as e:

        ai_analysis = None

        warnings.append(f"AI analysis unavailable: {str(e)}")

    # --------------------------
    # Future Projection
    # --------------------------

    try:
        future_projection = generate_future_projection(profile_data)

    except Exception as e:

        future_projection = None

        warnings.append(f"Future projection unavailable: {str(e)}")

    # --------------------------
    # Metadata
    # --------------------------

    processing_time = round(time.time() - start_time, 2)

    # --------------------------
    # Final Response
    # --------------------------

    return {

        "report": {
            "report_id": report_id,
            "generated_at": generated_at,
            "processing_time": f"{processing_time}s",
            "api_version": "1.0.0"
        },

        "profile": {
            "age": profile.age,
            "country": profile.country,
            "programming": profile.programming,
            "instrument": profile.instrument,
            "gym": profile.gym,
            "reads_books": profile.reads_books,
            "builds_projects": profile.builds_projects,
            "engineering_student": profile.engineering_student,
            "entrepreneurship_interest": profile.entrepreneurship_interest
        },

        "analysis": {
            "rarity_score": rarity["score"],
            "percentile": rarity["percentile"],
            "archetype": archetype["name"],
            "description": archetype["description"]
        },

        "matched_traits": rarity["matched_traits"],

        "insights": insights,

        "ai_analysis": ai_analysis,

        "future_projection": future_projection,

        "warnings": warnings
    }