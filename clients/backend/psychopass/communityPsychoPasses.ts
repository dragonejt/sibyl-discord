export type CommunityPsychoPass = {
    id: number
    community: number
    users: number[]

    area_stress_level: {
        toxicity: number
        severe_toxicity: number
        identity_attack: number
        insult: number
        threat: number
        profanity: number
        sexually_explicit: string
    }
};

class CommunityPsychoPasses {
    url = `${process.env.BACKEND_URL!}/psychopass/community`;

    async read(communityID: string): Promise<CommunityPsychoPass | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    // For Removing a User Psycho-Pass from a Community Psycho-Pass Only
    async update(communityID: string, userID: string): Promise<CommunityPsychoPass | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
                },
                body: JSON.stringify({ communityID, userID })
            });
            if (!response.ok) throw new Error(`PUT ${this.url}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}

export const communityPsychoPasses = new CommunityPsychoPasses();
