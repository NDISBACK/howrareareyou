from rarity_data import RARITY_WEIGHTS


def calculate_rarity(profile):

    score = 0
    matched_traits = []

    for trait, prevalence in RARITY_WEIGHTS.items():

        if getattr(profile, trait):

            rarity_points = (1 - prevalence) * 100

            score += rarity_points

            matched_traits.append({
                "trait": trait,
                "rarity_points": round(rarity_points, 1)
            })

    score = min(round(score / 5, 1), 100)

    return {
    "score": score,
    "percentile": round(score * 10),
    "matched_traits": matched_traits
}