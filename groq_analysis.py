import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_ai_analysis(profile_data):
    prompt = f"""
You are an expert psychologist and behavioral analyst.

Analyze the following profile:

{profile_data}

Provide a concise analysis including:
1. Personality Summary
2. Strengths
3. Weaknesses
4. Career Suggestions
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    profile = {
        "age": 18,
        "country": "India",
        "programming": True,
        "gym": True,
        "instrument": True,
        "builds_projects": True,
        "entrepreneurship_interest": True
    }

    print(generate_ai_analysis(profile))