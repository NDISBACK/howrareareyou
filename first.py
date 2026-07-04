import pyautogui
import time

text = """
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import UserProfile
from rarity_engine import calculate_rarity
from archetypes import determine_archetype
from insights import generate_insights
from groq_analysis import generate_ai_analysis
from future_projections import generate_future_projection

app = FastAPI(
    title="How Rare Are You API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {
        "status": "online",
        "message": "How Rare Are You API is running"
    }


@app.post("/analyze")
async def analyze(profile: UserProfile):

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

    try:
        ai_analysis = generate_ai_analysis(profile_data)
    except Exception as e:
        ai_analysis = f"AI analysis unavailable: {str(e)}"

    try:
        future_projection = generate_future_projection(profile_data)
    except Exception as e:
        future_projection = f"Future projection unavailable: {str(e)}"

    return {
        **profile_data,
        "ai_analysis": ai_analysis,
        "future_projection": future_projection
    }
"""

print("Click inside a text box in 5 seconds...")
time.sleep(5)

while True:
    for char in text:
        pyautogui.write(char)
        time.sleep(0.07)

    time.sleep(1)

    for _ in text:
        pyautogui.press("backspace")
        time.sleep(0.04)

    time.sleep(1)

