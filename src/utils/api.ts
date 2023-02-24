import { AUTH0_CLIENT } from "../globs/node";
import { error, log } from "@tsmodule/log";
import { DOMAIN_URL, PLATFORM } from "../globs/shared";

export async function checkAuth() {
  const authorized = await AUTH0_CLIENT.isAuthorized();
  if (!authorized) {
    error("You are not logged in.", [], { postLines: 1 });

    log("Use UPG to log in using `upg login`:", ["dim"]);
    log("https://gptlabs.us/upg", ["underline"]);

    process.exit(1);
  }
}
interface shellResponse {
  native: string;
}

export const fetchResponseFromApi = async (command: string, context: string) => {

  return await AUTH0_CLIENT.fetch(
    `${DOMAIN_URL}/api/gsh/shell`,
    {
      method: "POST",
      body: new URLSearchParams({
        command,
        platform: PLATFORM,
        context,
      })
    }
  ).then(async (res) => await res.json()) as shellResponse;
}