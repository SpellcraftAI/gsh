#!/usr/bin/env node
/* eslint-disable no-console */
import { createInterface } from "readline";
import { stdin, stdout } from "process";
import { appendToLog, getEntrapment, getTranscript } from "./utils/filesystem";
import { fetchResponseFromApi, checkAuth } from "./utils/api";
import {
  displayLogoAndVersion,
  entrapCommand,
  executeShellCommand,
  getModifiers,
} from "./utils/console";
import { displayError, trimLinePrefixes, promptStyle, displayOutput } from "./utils/display";

checkAuth();
displayLogoAndVersion();
const { isExecuting, isDryMode, isEntrapped } = await getModifiers();

const rl = createInterface({
  input: stdin,
  output: stdout
});

rl.on("SIGINT", () => {
  process.exit(1);
});

while (true) {
  try {
    const userInput = await new Promise<string>((resolve) => {
      rl.question(promptStyle, resolve);
    });

    const context = isEntrapped ? await getEntrapment() : await getTranscript();
    const command = isEntrapped ? await entrapCommand(userInput) : userInput;

    const { native } = await fetchResponseFromApi(command, context)
    const replacedLinePrefixes = trimLinePrefixes(native)

    if (isExecuting) {
      console.log();
      await executeShellCommand(replacedLinePrefixes);
      console.log();
    } else {

      await displayOutput(replacedLinePrefixes, isDryMode);
    }
    await appendToLog(isEntrapped, command, native);
  } catch (e: any) {
    console.log();
    displayError(`Error: ${e.message}`);
  }
}
