import { error, log, style } from "@tsmodule/log";

export const trimLinePrefixes = (shellText: string) => shellText?.trim().split("\n").map(
  (line: string) => line.replace(/^\$ /, "")
).join("\n");

export const promptStyle = `  ${style("$", ["bold", "dim"])} `;

export const displayHelp = () => {
  displayDimmed(`
    Usage: gsh [options] \n
    available options: \n
    --execute: run commands as they're received. \n
    --dry-run: run in dry-run, no command will be executed. \n
    --clear: clear transcript. \n
    --help: display this help. \n
    `);
};


export const displayWarning = (message: string) => {
  log(style(message, ["yellow"]));
};

export const displayAlert = (message: string) => {
  log(style(message, ["bold", "red", "underline"]));
};

export const displayError = (message: string) => {
  error(style(message, ["bold", "red"]));
};

export const displayDimmed = (message: string) => {
  log(style(message, ["dim"]));
};

export const displayPrompt = (message: string) => {
  log(message, ["bold"], { postLines: 0 });
};

export const displayOutput = (message: string, isDimmed = false) => {
  if (!isDimmed) {
    displayPrompt(message);
  } else {
    displayDimmed(message);
  }
};