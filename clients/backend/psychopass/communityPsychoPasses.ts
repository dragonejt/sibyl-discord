export interface CommunityPsychoPass {
  id: number;
  community: number;
  users: number[];

  area_stress_level: {
    toxicity: number;
    severe_toxicity: number;
    identity_attack: number;
    insult: number;
    threat: number;
    profanity: number;
    sexually_explicit: number;
  };
}

export class CommunityPsychoPasses {
  static url = `${process.env.BACKEND_URL!}/psychopass/community`;

  static async read(
    community_id: string,
  ): Promise<CommunityPsychoPass | undefined> {
    try {
      const response = await fetch(`${this.url}?id=${community_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
      });
      if (!response.ok)
        throw new Error(
          `GET ${this.url}?id=${community_id}: ${response.status} ${response.statusText}`,
        );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  // For Removing a User Psycho-Pass from a Community Psycho-Pass Only
  static async update(
    community_id: string,
    user_id: string,
  ): Promise<CommunityPsychoPass | undefined> {
    try {
      const response = await fetch(this.url, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
        body: JSON.stringify({ community_id, user_id }),
      });
      if (!response.ok)
        throw new Error(
          `PUT ${this.url}: ${response.status} ${response.statusText}`,
        );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}
