from os import getenv
from sys import version
from requests import get


class PsychoPasses:
    url = f"{getenv('BACKEND_URL')}/psychopass/user"

    @classmethod
    def read(cls, user_id: int) -> dict:
        response = get(
            f"{cls.url}?id={user_id}",
            headers={
                "Accept": "application/json",
                "User-Agent": f"sibyl-discord python/{version}",
                "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
            },
        )

        response.raise_for_status()
        return response.json()
