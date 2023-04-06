import { google } from "googleapis";

type AttributeScore = {
    spanScores: Array<object>,
    summaryScore: {
        value: number;
        type: string;
    }
}

export type MessageAnalysis = {
    attributeScores: {
        TOXICITY: AttributeScore,
        SEVERE_TOXICITY: AttributeScore,
        IDENTITY_ATTACK: AttributeScore,
        INSULT: AttributeScore,
        THREAT: AttributeScore,
        PROFANITY: AttributeScore,
        SEXUALLY_EXPLICIT: AttributeScore
    },
    detectedLanguages: Array<string>,
    languages: Array<string>,
    userID?: string,
    communityID?: string
}

const perspectiveAPI = await google.discoverAPI("https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1");

export const analyzeComment = async (comment: string): Promise<MessageAnalysis | undefined> => {
    try {
        const response = await (perspectiveAPI.comments as any).analyze({
            key: process.env.PERSPECTIVE_API_KEY,
            resource: {
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
            }
        });
        if (response.status != 200) throw new Error(`Perspective API Analyze Comment:  ${response.status} ${response.statusText}`);
        return response.data
    } catch (error) {
        console.error(error);
    }
}
