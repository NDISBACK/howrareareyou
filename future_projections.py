from groq import Groq
from dotenv import load_dotenv
import os
import json
import re

# Load environment variables
load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_future_projection(profile_data):

    prompt = f"""
You are a world-class behavioral analyst.

Analyze the following profile:

{profile_data}

Return ONLY valid JSON.

{{
    "likely_path": "",
    "greatest_strength": "",
    "greatest_risk": "",
    "next_level_trait": "",
    "five_year_projection": ""
}}

Rules:
- Return ONLY JSON.
- Do NOT wrap the response in markdown.
- Do NOT explain anything.
- Keep each value under 40 words.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an API. "
                    "Always respond with valid JSON only. "
                    "Never use markdown code fences."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
    )

    content = response.choices[0].message.content.strip()

    # Remove markdown fences if Groq still returns them
    content = re.sub(r"^```json\s*", "", content)
    content = re.sub(r"^```", "", content)
    content = re.sub(r"\s*```$", "", content)
    content = content.strip()

    try:
        return json.loads(content)

    except json.JSONDecodeError:
        return {
            "error": "Failed to parse AI response",
            "raw_response": content
        }


if __name__ == "__main__":
    sample_profile = {
        "age": 18,
        "country": "India",
        "programming": True,
        "gym": True,
        "builds_projects": True,
        "entrepreneurship_interest": True,
        "rarity_score": 92,
        "percentile": 965
    }

    print(generate_future_projection(sample_profile))