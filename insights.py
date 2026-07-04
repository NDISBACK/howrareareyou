def generate_insights(profile):

    insights = []

    # Builder
    if profile.programming and profile.builds_projects:
        insights.append(
            "You tend to create things rather than simply consume them."
        )

    # Technical + Creative
    if profile.programming and profile.instrument:
        insights.append(
            "Your profile combines technical and creative thinking."
        )

    # Discipline
    if profile.gym and profile.builds_projects:
        insights.append(
            "You show signs of long-term discipline and self-improvement."
        )

    # Ambition
    if profile.entrepreneurship_interest:
        insights.append(
            "You appear motivated by growth, ownership, and future opportunities."
        )

    # Learning mindset
    if profile.reads_books:
        insights.append(
            "You actively invest in learning and expanding your knowledge."
        )

    # Technical path
    if profile.engineering_student:
        insights.append(
            "Your background suggests strong analytical problem-solving skills."
        )

    if len(insights) == 0:
        insights.append(
            "Your profile shows a balanced mix of interests and experiences."
        )

    return insights