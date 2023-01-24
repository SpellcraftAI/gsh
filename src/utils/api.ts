import { AUTH0_CLIENT } from "../globs/node";
<<<<<<< HEAD
import { error, log } from "@tsmodule/log";

export async function checkAuth() {
    const authorized = await AUTH0_CLIENT.isAuthorized();
    if (!authorized) {
    error("You are not logged in.", [], { postLines: 1 });

    log("Use UPG to log in using `upg login`:", ["dim"]);
    log("https://gptlabs.us/upg", ["underline"]);

    process.exit(1);
    }
=======
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
>>>>>>> feat/transcript-limit
}