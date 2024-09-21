from os import getenv
from sys import version
from requests import post


def ingest_message(message: dict) -> None:

    response = post(
        f"{getenv('BACKEND_URL')}/psychopass/message",
        headers={
            "Accept": "application/json",
            "User-Agent": f"sibyl-discord python/{version}",
            "Authorization": f"Token {getenv('BACKEND_API_KEY')}",
        },
        json=message,
    )

    response.raise_for_status()
