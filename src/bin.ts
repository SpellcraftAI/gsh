#!/usr/bin/env node
/* eslint-disable no-console */
import { clear, error, log, style } from "@tsmodule/log";
import { AUTH0_CLIENT } from "./globs/node";
import { createInterface } from "readline";
import { stdin, stdout } from "process";
import { VERSION } from "./globs/shared";
import { appendToTranscript, getTranscript, rewriteTranscript } from "./utils/filesystem";
import { readFile } from "fs/promises";
import { fetchResponseFromApi } from "./utils/api";

const authorized = await AUTH0_CLIENT.isAuthorized();
if (!authorized) {
  error("You are not logged in.", [], { postLines: 1 });

  log("Use UPG to log in using `upg login`:", ["dim"]);
  log("https://gptlabs.us/upg", ["underline"]);

  process.exit(1);
}

const rl = createInterface({
  input: stdin,
  output: stdout,
});

rl.on("SIGINT", () => {
  process.exit(1);
});

clear({ flush: true });

const logoPath = new URL("./header.txt", import.meta.url);
const logoFile = await readFile(logoPath, "utf8");
const logoText = logoFile.replace("(A version number goes here)", VERSION);

console.log(style(logoText, ["dim"]));

// a function that checks if transcript has more than 3000 tokens
// if so, it will call fetchResponseFromApi with the command "Summarize the transcript"
// and the transcript as the argument

const enforceTranscriptLimit = async (transcript: string) => {
  const transcriptTokens = transcript.split(" ").length;
  if (transcriptTokens > 3000) {
    const { native } = await fetchResponseFromApi("Summarize the transcript", transcript)
    console.log(native);
    await rewriteTranscript(native);
  }
}

while (true) {
  const transcript = await getTranscript();
  await enforceTranscriptLimit(transcript);
  const command = await new Promise<string>((resolve) => {
    rl.question(` ${style("$", ["bold", "dim"])} `, resolve);
  });
  // console.log({ transcript });
  console.log();
  // console.log(style(command, ["dim"]));

  const { native } = await fetchResponseFromApi(command, transcript)

  const replacedLinePrefixes = native.trim().split("\n").map(
    (line: string) => line.replace(/^\$ /, "")
  ).join("\n");

  console.log(style(replacedLinePrefixes, ["dim"]));
  console.log();

  await appendToTranscript(command, native);
}
