from enum import StrEnum, IntEnum
from datetime import timedelta


class ATTRIBUTE(StrEnum):
    TOXICITY = "toxicity"
    SEVERE_TOXICITY = "severe_toxicity"
    IDENTITY_ATTACK = "identity_attack"
    INSULT = "insult"
    THREAT = "threat"
    PROFANITY = "profanity"
    SEXUALLY_EXPLICIT = "sexually_explicit"


class ACTION(IntEnum):
    NOTIFY = 0
    REMOVE = 1
    MUTE = 2
    KICK = 3
    BAN = 4


DEFAULT_TIMEOUT = timedelta(hours=1)


ATTR_PRETTY = {
    "crime_coefficient_100": "crime coefficient >= 100",
    "crime_coefficient_300": "crime coefficient >= 300",
    ATTRIBUTE.TOXICITY.value: "toxicity",
    ATTRIBUTE.SEVERE_TOXICITY.value: "severe toxicity",
    ATTRIBUTE.IDENTITY_ATTACK.value: "identity attack",
    ATTRIBUTE.INSULT.value: "insult",
    ATTRIBUTE.THREAT.value: "threat",
    ATTRIBUTE.PROFANITY.value: "profanity",
    ATTRIBUTE.SEXUALLY_EXPLICIT.value: "sexually explicit",
}
