import { AUTH0_CLIENT } from "../globs/node";
import { DOMAIN_URL, PLATFORM } from "../globs/shared";

export const fetchResponseFromApi = async (command: string, transcript: string) => {
    return await AUTH0_CLIENT.fetch(
    `${DOMAIN_URL}/api/gsh/shell`,
    {
      method: "POST",
      body: new URLSearchParams({
        command,
        platform: PLATFORM,
        transcript,
      })
    }
  ).then((res) => res.json()) as any;
}