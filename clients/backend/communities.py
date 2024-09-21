from os import getenv
from sys import version
from requests import get, post, put, delete


class Communities:
    url = f"{getenv('BACKEND_URL')}/community"

    @classmethod
    def create(cls, community_id: str) -> dict:
        response = post(
            cls.url,
            headers={
                "Accept": "application/json",
                "User-Agent": f"sibyl-discord python/{version}",
                "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
            },
            json={"communityID": community_id},
        )

        response.raise_for_status()
        return response.json()

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

    @classmethod
    def update(cls, data: dict) -> dict:
        response = put(
            cls.url,
            headers={
                "Accept": "application/json",
                "User-Agent": f"sibyl-discord python/{version}",
                "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
            },
            json=data,
        )

        response.raise_for_status()
        return response.json()

    @classmethod
    def delete(cls, community_id: str) -> None:
        response = delete(
            f"{cls.url}?id={community_id}",
            headers={
                "User-Agent": f"sibyl-discord python/{version}",
                "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
            },
        )

        response.raise_for_status()
