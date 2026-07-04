from models import UserProfile
from archetypes import determine_archetype

user = UserProfile(
    age=18,
    country="India",
    programming=True,
    instrument=True,
    gym=True,
    reads_books=False,
    builds_projects=True,
    engineering_student=True,
    entrepreneurship_interest=True
)

print(determine_archetype(user))