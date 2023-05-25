import { log, style } from "@tsmodule/log";
import { createShell } from "universal-shell";
import { VERSION } from "../globs/shared";
import { displayWarning } from "./display";
// import { clearTranscript } from "./filesystem";

export const executeShellCommand = async (command: string) => {
  const shell = createShell({
    stdio: ["inherit"],
    shell: true,
    log: false,
    silent: true,
  });

  const startTime = performance.now();
  const result = await shell.run(`${command}`);
  const endTime = performance.now();
  const duration = endTime - startTime;

  const { code } = result;

  const failed = code !== 0;
  if (failed) {
    displayWarning(
      style(`${command} exited with code ${code}.`, ["dim", failed ? "red" : "green"]) + "\n" +
            `Execution time: ${duration.toFixed(2)}ms`,
    );
  }

  return result;
};

export const displayLogoAndVersion = async () => {
  // const logoPath = new URL("./header.txt", import.meta.url);
  // const logoFile = await readFile(logoPath, "utf8");
  // const logoText = logoFile.replace("(A version number goes here)", VERSION);

  log(style(`GSH v${VERSION}\n`, ["bold", "dim"]));
};