export const ingestMessage = async message => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/profiles/message`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                "Authorization": `Token ${process.env.BACKEND_API_KEY}`
            },
            body: JSON.stringify(message),
        });
    } catch (error) {
        console.error(error);
    }
}

export const createCommunity = async communityID => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/profiles/community`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                "Authorization": `Token ${process.env.BACKEND_API_KEY}`
            },
            body: JSON.stringify({ communityID })
        });
    } catch (error) {
        console.error(error);
    }
}

export const deleteCommunity = async communityID => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/profiles/community?id=${communityID}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                "Authorization": `Token ${process.env.BACKEND_API_KEY}`
            }
        });
    } catch (error) {
        console.error(error);
    }
}