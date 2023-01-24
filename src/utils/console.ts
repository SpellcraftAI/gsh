import { style } from "@tsmodule/log";
import { exec } from "child_process";
import { readFile } from "fs/promises";
import { VERSION } from "../globs/shared";

export const displayLogoAndVersion = async () => {
    const logoPath = new URL("./header.txt", import.meta.url);
    const logoFile = await readFile(logoPath, "utf8");
    const logoText = logoFile.replace("(A version number goes here)", VERSION);

    console.log(style(logoText, ["dim"]));
}

export const displayWarning = (message: string) => {
    console.log(style(message, ["bold", "yellow"]));
}

export const displayDimmed = (message: string) => {
    console.log(style(message, ["dim"]));
}

export const trimLinePrefixes = (shellText: string) => shellText.trim().split("\n").map(
    (line: string) => line.replace(/^\$ /, "")
  ).join("\n");

export const promptStyle = ` ${style("$", ["bold", "dim"])} `;

export const executeCommand = async (command: string) => {
    exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stderr) {
          console.error(stderr);
        }
  
        console.log(stdout);
      });
}