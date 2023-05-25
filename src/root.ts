import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * This file has to be in the root directory to ensure that the relative path
 * does not change at runtime after the source is compiled.
 */
export const PROJECT_ROOT =
  typeof __dirname === "undefined"
    ? dirname(fileURLToPath(import.meta.url))
    : __dirname;