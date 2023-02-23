import { log, style } from "@tsmodule/log";
import { readFile } from "fs/promises";
import child_process from "child_process";
import { VERSION } from "../globs/shared";
import { promisify } from "util";

export const executeCommand = async (command: string) => {
    const exec = promisify(child_process.exec);
    const { stdout, stderr } = await exec(`${command}`);
    displayPrompt(`${stdout}`);
    displayError(`${stderr}`);
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