import { Auth0NodeClient } from "auth0-node-client";
import { homedir } from "os";
import { resolve } from "path";

export const AUTH0_CLIENT = new Auth0NodeClient({
  domain: "auth.spellcraftai.com",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/",
});

export const CONFIG_FILES = {
  TRANSCRIPT: resolve(homedir(), ".gsh", "transcript.txt"),
};