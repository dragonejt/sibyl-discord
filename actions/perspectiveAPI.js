import { google } from "googleapis";

const perspectiveAPI = await google.discoverAPI("https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1");

export const analyzeMessage = async message => {
    if (message.author.id == process.env.DISCORD_CLIENT_ID || message.guildId != "1063590532711972945") return;

    try {
        const analysis = await perspectiveAPI.comments.analyze({
            key: process.env.PERSPECTIVE_API_KEY,
            resource: {
                comment: {
                    text: message.content
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
            }
        });
        console.log(analysis.data);
    } catch (error) {
        console.error(error);
    }
}