import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { CONFIG_FILES } from "../globs/node";

const getFile = async (path: string) => {
  const dir = dirname(path);
  if (existsSync(path)) {
    return await readFile(path, "utf8");
  }

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  await writeFile(path, "", "utf8");
  return "";
};

export const getConfig = async (type: keyof typeof CONFIG_FILES) => {
  const file = await getFile(CONFIG_FILES[type]);
  return JSON.parse(file || "{}");
};

export const getTranscript = async () => {
  const file = await getFile(CONFIG_FILES.TRANSCRIPT);
  return file || "";
};

export const appendToTranscript = async (
  command: string,
  native: string,
) => {
  const transcriptItem =
`${command}

${native}`;

  await writeFile(
    CONFIG_FILES.TRANSCRIPT,
    transcriptItem,
    { flag: "a" }
  );
};
