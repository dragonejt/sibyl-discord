export type PsychoPass = {
    id: number
    platform: string
    user_id: string
    last_flag: string
    messages: number
    psycho_hazard: boolean

    toxicity: number
    severe_toxicity: number
    identity_attack: number
    insult: number
    threat: number
    profanity: number
    sexually_explicit: string
    crime_coefficient: number
    hue: string
};

class PsychoPasses {
    url: string = `${process.env.BACKEND_URL!}/psychopass/user`;

    async read(userID: string): Promise<PsychoPass | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${userID}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${userID}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}

export const psychoPasses = new PsychoPasses();
