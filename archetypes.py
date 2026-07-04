ARCHETYPES = {
    "Visionary Builder": {
        "name": "Visionary Builder",
        "description": "You create, innovate and constantly look for opportunities to build something meaningful."
    },
    "Builder": {
        "name": "Builder",
        "description": "You enjoy turning ideas into reality through projects and problem solving."
    },
    "Athlete": {
        "name": "Athlete",
        "description": "You focus on discipline, performance and personal growth."
    },
    "Scholar": {
        "name": "Scholar",
        "description": "You seek knowledge and enjoy understanding how the world works."
    },
    "Visionary": {
        "name": "Visionary",
        "description": "You are driven by ambition and big future goals."
    },
    "Explorer": {
        "name": "Explorer",
        "description": "You enjoy experiencing different paths and discovering new interests."
    }
}


def determine_archetype(profile):

    if (
        profile.programming
        and profile.builds_projects
        and profile.entrepreneurship_interest
    ):
        return ARCHETYPES["Visionary Builder"]

    elif profile.programming and profile.builds_projects:
        return ARCHETYPES["Builder"]

    elif profile.gym and not profile.programming:
        return ARCHETYPES["Athlete"]

    elif profile.reads_books and not profile.gym:
        return ARCHETYPES["Scholar"]

    elif profile.entrepreneurship_interest:
        return ARCHETYPES["Visionary"]

    return ARCHETYPES["Explorer"]