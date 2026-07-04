from pydantic import BaseModel

class UserProfile(BaseModel):
    age: int
    country: str

    programming: bool
    instrument: bool
    gym: bool
    reads_books: bool
    builds_projects: bool

    engineering_student: bool
    entrepreneurship_interest: bool