import * as fs from "fs";
import test from "ava";
import { TRANSCRIPT_LIMIT } from "../src/globs/shared";
import { appendToTranscript, getTranscript } from "../src/utils/filesystem";

test("transcript should always be less than transcript limit of characters", async (t) => {
    const sampleCommand = "Write some test code.";
    const overLengthLimitText = sampleCommand.repeat(TRANSCRIPT_LIMIT / 2);
    await appendToTranscript(sampleCommand, overLengthLimitText);
    const transcript = await getTranscript();
    t.true(transcript.length < TRANSCRIPT_LIMIT);
});