import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { CONFIG_FILES } from "../globs/node";
import { TRANSCRIPT_CHARACTER_LIMIT } from "../globs/shared";
import { Transcript } from "./api";
import { ChatCompletionRequestMessage } from "openai";
import { createDebugLogger } from "debug-logging";

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

export const withCharacterLimit = (transcript: Transcript) => {
  let characterCount = 0;
  const trimmedTranscript: Transcript = [];

  for (const message of transcript.reverse()) {
    characterCount += message.content.length;
    if (characterCount <= TRANSCRIPT_CHARACTER_LIMIT) {
      trimmedTranscript.push(message);
    } else {
      break;
    }
  }

  return trimmedTranscript.reverse();
};

export const getConfig = async (type: keyof typeof CONFIG_FILES) => {
  const file = await getFile(CONFIG_FILES[type]);
  return JSON.parse(file || "{}");
};

export const getTranscript = async (): Promise<Transcript> => {
  const file = await getFile(CONFIG_FILES.TRANSCRIPT);
  const linesWithData = file.split("\n").filter(Boolean);

  const parsedJsonLines = linesWithData.map((line) => JSON.parse(line));
  const transcript = withCharacterLimit(parsedJsonLines);

  return transcript;
};

export const clearTranscript = async () => {
  await writeFile(CONFIG_FILES.TRANSCRIPT, "", "utf8");
};

export async function appendToFile(path: string, content: string) {
  await writeFile(path, content, { flag: "a" });
}

export async function addToTranscript(
  ...messages: ChatCompletionRequestMessage[]
) {
  const DEBUG = createDebugLogger(addToTranscript);

  for (const message of messages) {
    if (!message.role || !message.content) {
      DEBUG.log("Invalid message", { message });
      return;
    }

    await appendToFile(
      CONFIG_FILES.TRANSCRIPT,
      JSON.stringify(message) + "\n"
    );
  }
}
