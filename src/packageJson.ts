import { readFile } from "fs/promises";
import { resolve } from "path";
import { PROJECT_ROOT } from "./root";

export type PackageJson = Record<string, string>;

export const getPackageJson = async (): Promise<PackageJson | null> => {
  const packageJsonPath = resolve(PROJECT_ROOT, "package.json");

  try {
    return JSON.parse(await readFile(packageJsonPath, "utf8"));
  } catch (e) {
    return null;
  }
};

export const getPackageJsonValue = async (field: string) => {
  const packageJson = await getPackageJson();
  return packageJson?.[field] ?? null;
};