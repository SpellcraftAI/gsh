import { log, style } from "@tsmodule/log";
import { readFile } from "fs/promises";
import { createShell } from "universal-shell";
import { VERSION } from "../globs/shared";
export const executeCommand = async (command: string) => {
    const shell = createShell({
    stdio: ["inherit"],
    shell: true,
    log: true,
    });
    const startTime = performance.now();
    const { code: exitCode } = await shell.run(`${command}`);
    const endTime = performance.now();
    const duration = endTime - startTime;
  
  
    const failed = exitCode !== 0;
    if (failed) {
        displayWarning(
        style(`${command} exited with code ${exitCode}.`, ["dim", failed ? "red" : "green"]) + "\n" +
        `Execution time: ${duration.toFixed(2)}ms`,
        );
    }
}

export const displayLogoAndVersion = async () => {
    const logoPath = new URL("./header.txt", import.meta.url);
    const logoFile = await readFile(logoPath, "utf8");
    const logoText = logoFile.replace("(A version number goes here)", VERSION);

    log(style(logoText, ["dim"]));
}

export const displayWarning = (message: string) => {
    log(style(message, ["bold", "yellow"]));
}

export const displayError = (message: string) => { 
    log(style(message, ["bold", "red"]));
}

export const displayDimmed = (message: string) => {
    log(style(message, ["dim"]));
}

export const displayPrompt = (message: string) => {
   log(style(message, ["bold"]));
}

export const trimLinePrefixes = (shellText: string) => shellText?.trim().split("\n").map(
    (line: string) => line.replace(/^\$ /, "")
  ).join("\n");

export const promptStyle = ` ${style("$", ["bold", "dim"])} `;