export interface MemberDominator {
  id: number;
  community: number;
  community_id?: string;

  crime_coefficient_100_action: number;
  crime_coefficient_300_action: number;
  toxicity_action: number;
  toxicity_threshold: number;
  severe_toxicity_action: number;
  severe_toxicity_threshold: number;
  identity_attack_action: number;
  identity_attack_threshold: number;
  insult_action: number;
  insult_threshold: number;
  threat_action: number;
  threat_threshold: number;
  profanity_action: number;
  profanity_threshold: number;
  sexually_explicit_action: number;
  sexually_explicit_threshold: number;
}

export class MemberDominators {
  static url = `${process.env.BACKEND_URL!}/dominator/member`;

  static async read(
    community_id: string,
  ): Promise<MemberDominator | undefined> {
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

  static async update(
    data: Partial<MemberDominator>,
  ): Promise<MemberDominator | undefined> {
    try {
      const response = await fetch(this.url, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
        body: JSON.stringify(data),
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

  static async delete(community_id: string) {
    try {
      const response = await fetch(`${this.url}?id=${community_id}`, {
        method: "DELETE",
        headers: {
          "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
          Authorization: `Token ${process.env.BACKEND_API_KEY!}`,
        },
      });
      if (!response.ok)
        throw new Error(
          `DELETE ${this.url}?id=${community_id}: ${response.status} ${response.statusText}`,
        );
    } catch (error) {
      console.error(error);
    }
  }
}
