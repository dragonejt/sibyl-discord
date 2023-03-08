class CommunityPsychoPasses {
    url;
    constructor(url = `${process.env.BACKEND_URL}/psychopass/community`) {
        this.url = url;
    }

    async get(communityID) {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) return response.status
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async create(communityID) {
        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                },
                body: JSON.stringify({ communityID })
            });
            if (!response.ok) return response.status
        } catch (error) {
            console.error(error);
        }
    }

    async delete(communityID) {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) return response.status
        } catch (error) {
            console.error(error);
        }
    }

}

const communityPsychoPasses = new CommunityPsychoPasses();
export default communityPsychoPasses;