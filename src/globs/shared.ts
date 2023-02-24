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

export const DEFAULT_ENTRAPMENT = `Do not talk to the user, only output a simulation of a SSH session with established connection. It's a Ubuntu 18.04 server. Take the session history in consideration. The user will type linux commands and you will reply with what the terminal should show in a linux context. The user input is always a command in a bash session, every command should give an expected output from a bash terminal, including the execution of programs. You will only reply with the terminal output. Do not write explanations or questions. Do not type commands. If the user tries an invalid command in an expected Linux environment, output error message. The user command now is: {{command}}`;
