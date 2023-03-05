class UserProfile {
    url;
    constructor(url = `${process.env.BACKEND_URL}/profiles/user`) {
        this.url = url;
    }

    async get(userID) {
        try {
            const response = await fetch(`${this.url}?id=${userID}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) return response.status;
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }
}

const userProfile = new UserProfile();
export default userProfile;