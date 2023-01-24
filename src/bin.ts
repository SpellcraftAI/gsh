#!/usr/bin/env node
/* eslint-disable no-console */
import { clear } from "@tsmodule/log";
import { createInterface } from "readline";
import { stdin, stdout } from "process";
import { appendToTranscript, getTranscript } from "./utils/filesystem";
import { fetchResponseFromApi } from "./utils/api";
import { checkAuth } from "./utils/api";
import {
  displayDimmed,
  displayLogoAndVersion,
  displayWarning,
  executeCommand,
  promptStyle as styledPrompt,
  trimLinePrefixes,
} from "./utils/console";

checkAuth();

const rl = createInterface({
  input: stdin,
  output: stdout,
});

rl.on("SIGINT", () => {
  process.exit(1);
});

clear({ flush: true });

await displayLogoAndVersion();

const shouldExecute = process.argv.slice(2).includes('--execute');
if (shouldExecute) {
  displayWarning("Experimental feature. Commands will be executed.");
  displayWarning("It can have unintended consequences. Use at your own risk.")
}

while (true) {
  const transcript = await getTranscript();
  const command = await new Promise<string>((resolve) => {
    rl.question(styledPrompt, resolve);
  });

  console.log();

  const { native } = await fetchResponseFromApi(command, transcript)

  if (native) {
    const replacedLinePrefixes = trimLinePrefixes(native);

    displayDimmed(replacedLinePrefixes);

    console.log();

    if (shouldExecute) {
      await executeCommand(replacedLinePrefixes);
    }

    console.log();

    await appendToTranscript(command, native);
  }
}