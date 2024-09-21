from os import getenv
from requests import post


def analyze_comment(comment: str) -> dict:

    response = post(
        f"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key={getenv('PERSPECTIVE_API_KEY')}",
        headers={
            "Accept": "application/json",
        },
        json={
            "comment": {
                "text": comment,
            },
            "requestedAttributes": {
                "TOXICITY": {},
                "SEVERE_TOXICITY": {},
                "IDENTITY_ATTACK": {},
                "INSULT": {},
                "PROFANITY": {},
                "THREAT": {},
                "SEXUALLY_EXPLICIT": {},
            },
            "clientToken": "sibyl-discord",
        },
    )

    response.raise_for_status()
    return response.json()
