import { readFile, writeFile } from "fs/promises";
import test from "ava";
import { TRANSCRIPT_CHARACTER_LIMIT } from "../src/globs/shared";
import { getTranscript } from "../src/utils/filesystem";
import { CONFIG_FILES } from "../src/globs/node";

test("transcript should always be less than transcript character limit", async (t) => {
  // Creates transcript file if it doesn't exist or get existing transcript
  const existingTranscript = await getTranscript();

  // Gets sample transcript text with more than 3500 tokens
  const __dirname = new URL(".", import.meta.url).pathname;
  const transcriptTestText = await readFile(__dirname + "transcript.test.txt", "utf8");

  // Writes sample transcript text to transcript file
  await writeFile(CONFIG_FILES.TRANSCRIPT, transcriptTestText, "utf8");

  const transcript = await getTranscript();

  // Rewrite transcript file with original transcript
  await writeFile(CONFIG_FILES.TRANSCRIPT, existingTranscript, "utf8");

  t.true(!transcript.includes("This should be cut out."));
  t.true(transcript.length <= TRANSCRIPT_CHARACTER_LIMIT);
});