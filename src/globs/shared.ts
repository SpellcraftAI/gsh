import { platform } from "os";
import { env } from "process";
// import { highlight as highlightRaw } from "cli-highlight";
import { getPackageJson } from "../packageJson";

/**
 * Whether or not users must have a valid subscription to access the API.
 */
export const SUBSCRIPTION_LOCK = true;

/**
 * The contents of the package.json file at runtime.
 */
export const PACKAGE_JSON = await getPackageJson();
if (!PACKAGE_JSON) {
  throw new Error("Failed to get package.json. Please report this: https://twitter.com/gptlabs");
}

/**
 * The version of this package at runtime.
 */
export const { version: VERSION } = PACKAGE_JSON;

/**
 * Whether this is the canary build.
 */
export const CANARY = VERSION.includes("canary");

/**
 * Whether this process is running in development mode.
 */
export const DEVELOPMENT = (
  /** Inlined by compiler. */
  process.env.NODE_ENV === "development" ||
  /** Checked at runtime. */
  env.NODE_ENV === "test"
);

export const TESTING = env.NODE_ENV === "test";
export const PRODUCTION = !DEVELOPMENT;

/**
 * The URL this site is running on.
 */
export const DOMAIN =
  PRODUCTION
    ? (
      CANARY
        ? "canary.gptlabs.us"
        : "api.gptlabs.us"
    )
    : "localhost:3000";

export const DOMAIN_URL =
  DOMAIN === "localhost:3000"
    ? `http://${DOMAIN}`
    : `https://${DOMAIN}`;



export const PLATFORM = platform();

export const TRANSCRIPT_LIMIT = 3500;

export const DEFAULT_ENTRAPMENT = `\n\nInstructions: Do not talk to the user, only output a simulation of a SSH session with established connection. It should mirror a Unix server. Take the session history in consideration. Only reply with the output expected from the command given the Unix platform. You will only reply with the terminal output.  Do not type commands. Do not reply with commands. If the user tries an invalid command in an expected Unix environment, output error message. The user command now is: {{command}}\n\nSession History:\n\n`;
