export const ingestMessage = async message => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/profiles/message`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "User-Agent": "sibyl-discord (node.js)",
                "Authorization": `Token ${process.env.BACKEND_API_KEY}`
            },
            body: JSON.stringify(message),
        })
    } catch (error) {
        console.error(error)
    }
}