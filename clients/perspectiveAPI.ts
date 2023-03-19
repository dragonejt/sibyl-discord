export const analyzeComment = async (comment: string) => {
    try {
        const response = await fetch(
            `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comment: {
                        text: comment
                    },
                    requestedAttributes: {
                        TOXICITY: {},
                        SEVERE_TOXICITY: {},
                        IDENTITY_ATTACK: {},
                        INSULT: {},
                        PROFANITY: {},
                        THREAT: {},
                        SEXUALLY_EXPLICIT: {}
                    },
                    languages: ["en"]
                })
        });
        if (!response.ok) throw new Error(`Perspective API Analyze Comment:  ${response.status} ${response.statusText}`);
        return response.json();
        
    } catch (error) {
        console.error(error);
    }
}
