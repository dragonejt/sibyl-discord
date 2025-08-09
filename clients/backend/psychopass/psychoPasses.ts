export interface PsychoPass {
  id: number;
  platform: number;
  user_id: string;
  messages: number;

  toxicity: number;
  severe_toxicity: number;
  identity_attack: number;
  insult: number;
  threat: number;
  profanity: number;
  sexually_explicit: number;
  crime_coefficient: number;
  hue: string;
}

export class PsychoPasses {
  static url = `${process.env.BACKEND_URL!}/psychopass/user`;

  static async read(user_id: string): Promise<PsychoPass | undefined> {
    try {
      const response = await fetch(`${this.url}?id=${user_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
      });
      if (!response.ok)
        throw new Error(
          `GET ${this.url}?id=${user_id}: ${response.status} ${response.statusText}`,
        );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}
