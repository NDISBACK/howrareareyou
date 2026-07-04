Heads up :- i am running it on free version of render so the final screen where you rankings gets processed might take some time :)

AI USAGE DECLARATION :- AI has been used in this project to assist with debugging of the code as well as the formatting and some parts of the writing of DEVLOGS and this readme file.

# 🧠 How Rare Are You?

> **How Rare Are You?** is a full-stack AI-powered behavioral analysis platform that estimates how statistically unique a person is based on their skills, interests, habits, and ambitions. By combining deterministic rarity algorithms with Large Language Models (LLMs), the platform generates rich, personalized reports including rarity scores, archetypes, AI insights, and future projections.

---

## ✨ Features

* 🎯 Custom rarity scoring engine
* 📊 Percentile estimation
* 🧬 Behavioral archetype classification
* 🧠 AI-generated personality analysis powered by Groq
* 🔮 AI-powered future projection
* 💡 Rule-based behavioral insights
* ⚡ Real-time FastAPI backend
* 🎨 Modern interactive Next.js frontend
* 📱 Responsive and animated UI
* ☁️ Cloud deployment ready

---

# 🏗️ Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion

---

## Backend

* Python
* FastAPI
* Pydantic
* Uvicorn

---

## AI

* Groq API
* Llama 3.3 70B Versatile

---

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# 🧠 System Architecture

```text
                    User
                      │
                      ▼
             Next.js Frontend
                      │
        POST /analyze (JSON)
                      │
                      ▼
               FastAPI Backend
                      │
     ┌────────────────┼────────────────┐
     │                │                │
     ▼                ▼                ▼
Rarity Engine   Archetype Engine  Insight Engine
     │                │                │
     └────────────────┼────────────────┘
                      │
                      ▼
               Profile Context
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
Groq Personality Analysis   Future Projection
        │                           │
        └─────────────┬─────────────┘
                      ▼
              Final JSON Report
```

---

# ⚙️ Analysis Pipeline

The application processes each user profile through multiple independent analysis stages.

## 1. Profile Validation

Incoming user data is validated using Pydantic models.

Example:

* Age
* Country
* Programming
* Gym
* Reading
* Music
* Projects
* Entrepreneurship

---

## 2. Rarity Engine

A deterministic algorithm evaluates the rarity of individual traits using predefined rarity weights.

Outputs:

* Rarity Score
* Percentile
* Matched Traits

---

## 3. Archetype Engine

The user's behavioral patterns are classified into a primary archetype.

Current archetypes include:

* Visionary Builder
* Builder
* Athlete
* Scholar
* Visionary
* Explorer

---

## 4. Insight Generator

A rule-based inference engine identifies meaningful combinations of user traits and generates behavioral observations.

Example:

* Technical + Creative
* Builder Mindset
* Growth Orientation
* Discipline
* Analytical Thinking

---

## 5. AI Personality Analysis

The structured profile is passed to Groq's Llama 3.3 model.

The model generates:

* Personality Summary
* Strongest Traits
* Hidden Strengths
* Potential Weaknesses
* Career Suggestions

---

## 6. Future Projection

A second AI prompt predicts:

* Likely Career Path
* Greatest Strength
* Biggest Risk
* Next Growth Area
* Five-Year Projection

---

# 📁 Project Structure

```text
how-rare-are-you/

│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── styles/
│   └── ...
│
├── main.py
├── models.py
├── rarity_engine.py
├── rarity_data.py
├── archetypes.py
├── insights.py
├── groq_analysis.py
├── future_projections.py
├── requirements.txt
├── .env.example
└── README.md
```

---

# 🚀 Running Locally

## Clone

```bash
git clone https://github.com/YOUR_USERNAME/howrareareyou.git

cd howrareareyou
```

---

## Backend

Install dependencies

```bash
pip install -r requirements.txt
```

Create:

```text
.env
```

```env
GROQ_API_KEY=YOUR_API_KEY
```

Run:

```bash
uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

Swagger:

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 API

## GET /

Returns server status.

---

## GET /health

Health check endpoint.

---

## POST /analyze

Accepts a user profile and returns a complete behavioral report.

Example request:

```json
{
    "age":18,
    "country":"India",
    "programming":true,
    "instrument":true,
    "gym":true,
    "reads_books":true,
    "builds_projects":true,
    "engineering_student":true,
    "entrepreneurship_interest":true
}
```

---

Example response:

```json
{
    "report": {},
    "profile": {},
    "analysis": {},
    "matched_traits": [],
    "insights": [],
    "ai_analysis": "...",
    "future_projection": {}
}
```

---

# 🔒 Environment Variables

Backend

```
GROQ_API_KEY=
```

Frontend

```
NEXT_PUBLIC_API_URL=
```

---

# 📈 Current Status

## Backend

* ✅ Complete

## Frontend

* 🚧 In Progress

Current frontend includes:

* Landing Page
* Question Flow
* Analysis Screen
* Results Page

Backend integration is currently being finalized.

---

# 🛣️ Roadmap

### Phase 1

* Backend API
* Rarity Engine
* AI Analysis
* Future Projection

✅ Complete

---

### Phase 2

* Interactive Frontend
* Claymorphism UI
* Animations
* Responsive Design

🚧 In Progress

---

### Phase 3

* Shareable Report Cards
* User Accounts
* Database Integration
* Real Percentile Rankings
* AI Chat with Your Profile

⏳ Planned

---

# 🤖 AI Workflow

The application uses a hybrid architecture.

Traditional algorithms are responsible for:

* Scoring
* Percentiles
* Archetypes
* Deterministic insights

Large Language Models are responsible for:

* Personality interpretation
* Behavioral reasoning
* Career suggestions
* Future projections
* Natural language report generation

This separation keeps numerical outputs deterministic while allowing AI to generate rich, human-readable insights.

---

# 📄 License

This project is intended for educational and portfolio purposes.

---

## Built With ❤️

Created using **Python**, **FastAPI**, **Next.js**, **Tailwind CSS**, **Groq**, and **Llama 3.3**, blending deterministic behavioral modeling with modern AI reasoning to create a unique personality analysis experience.
