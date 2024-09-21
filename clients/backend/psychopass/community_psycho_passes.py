from os import getenv
from sys import version
from requests import get, put


class CommmunityPsychoPasses:
    url = f"{getenv('BACKEND_URL')}/psychopass/community"

    @classmethod
    def read(cls, community_id: int) -> dict:
        response = get(
            f"{cls.url}?id={community_id}",
            headers={
                "Accept": "application/json",
                "User-Agent": f"sibyl-discord python/{version}",
                "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
            },
        )

        response.raise_for_status()
        return response.json()

    # For Removing a User Psycho-Pass from a Community Psycho-Pass Only
    @classmethod
    def update(cls, community_id: int, user_id: int) -> dict:
        response = put(
            cls.url,
            headers={
                "Accept": "application/json",
                "User-Agent": f"sibyl-discord python/{version}",
                "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
            },
            json={"communityID": community_id, "userID": user_id},
        )

        response.raise_for_status()
        return response.json()
