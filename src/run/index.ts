/* eslint-disable no-console */
import { createInterface } from "readline";
import { stdin, stdout } from "process";
import { checkAuth, clearTranscript, displayError, displayOutput, displayWarning, executeShellCommand, promptStyle, sendChatMessage, trimLinePrefixes } from "../utils";

export interface RunOptions {
  dangerous?: boolean;
  clear?: boolean;
}

export const run = async ({
  dangerous = false,
  clear = false,
}: RunOptions = {}) => {
  await checkAuth();
  // @todo - Enable this again later.
  // await displayLogoAndVersion();

  if (clear) {
    await clearTranscript();
  }

  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  rl.on("SIGINT", () => {
    process.exit(1);
  });

  if (!dangerous) {
    displayWarning("SAFE MODE: Commands are not executed.");
  } else {
    displayError("WARNING: COMMANDS WILL RUN. Safe mode is disabled.");
  }

  while (true) {
    try {
      console.log();

      const userInput = await new Promise<string>((resolve) => {
        rl.question(promptStyle, resolve);
      });

      console.log();

      const chatResponse = await sendChatMessage(userInput);
      const replacedLinePrefixes = trimLinePrefixes(chatResponse);

      if (!dangerous) {
        displayOutput(replacedLinePrefixes, dangerous);
      } else {
        const {
          stdout,
          stderr
        } = await executeShellCommand(replacedLinePrefixes);

        stdout && displayOutput(stdout, false);
        stderr && displayError(stderr);
      }
    } catch (e: any) {
      console.log();
      displayError(`Error: ${e.message}`);
    }
  }
};