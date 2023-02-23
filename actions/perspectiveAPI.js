import { google } from "googleapis";

const PERSPECTIVE_API_URL = "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";
const perspectiveAPI = await google.discoverAPI(PERSPECTIVE_API_URL);

export const analyzeMessage = async message => {
    if (message.isChatInputCommand || message.guildId != "1063590532711972945") return;

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
                }
            }
        });
        console.log(analysis.data);
    } catch (error) {
        console.error(error);
    }
}