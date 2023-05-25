import { platform } from "os";
import { env } from "process";
import { getPackageJson } from "../packageJson";

/**
 * Whether or not users must have a valid subscription to access the API.
 */
export const SUBSCRIPTION_LOCK = true;

/**
 * The version of this package at runtime.
 */
export const getVersion = async () => {
  const packageJson = await getPackageJson();
  return packageJson?.version;
};

/**
 * Whether this is the canary build.
 */
export const isCanary = async () => {
  const version = await getVersion();
  return version?.includes("canary") ?? false;
};

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
export const getDomain = async () => {
  const canary = await isCanary();
  return (
    PRODUCTION
      ? (
        canary
          ? "canary.spellcraft.org"
          : "api.spellcraft.org"
      )
      : "localhost:3000"
  );
};

export const getDomainURL = async () => {
  const domain = await getDomain();
  return (
    domain === "localhost:3000"
      ? `http://${domain}`
      : `https://${domain}`
  );
};

export const PLATFORM = platform();

export const TRANSCRIPT_CHARACTER_LIMIT = 2000;