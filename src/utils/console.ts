import { log, style } from "@tsmodule/log";
import { readFile } from "fs/promises";
import { createShell } from "universal-shell";
import { DEFAULT_ENTRAPMENT, VERSION } from "../globs/shared";
import { clearTranscriptAndEntrappedLog, getEntrapment } from "./filesystem";
import { displayEntrapment, displayHelp, displayWarning } from "./display";

export const executeShellCommand = async (command: string) => {
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

const getMode = (args: string[]) => {
    let mode = "";
    args.forEach((arg) => {
        switch (arg) {
            case "--dry-mode":
                mode = "dry-mode";
                displayWarning("You're running in dry-mode, no command will be executed.");
                break;
            case "--entrap":
                mode = "entrap";
                displayWarning("You're running in entrap-mode, no command will be executed.");
                break;
            default:
                break;
        }
    });

    return mode;
}

export const getModifiers = async () => {
    const mode = await promptSetup();
    const isEntrapped = mode === "entrap";
    const isDryMode = mode === "dry-mode";
    const isExecuting = !isDryMode && !isEntrapped;
    return { isDryMode, isEntrapped, isExecuting };
}

const executePreCommand = async (preCommand: string) => {
    switch (preCommand) {
        case "clear":
            await clearTranscriptAndEntrappedLog();
            break;
        case "help":
            displayHelp();
            break;
        default:
            break;
    }
}

const dispatch = async (args: string[]) => {
    if (args.includes("--clear")) {
        executePreCommand("clear");
     }

     if (args.includes("--help")) {
         executePreCommand("help");
         process.exit(0);
    }

    if (args.includes("--debug")) {
        executePreCommand("debug");
    }
} 

export const promptSetup = async () => {
    const args = process.argv.slice(2);
    const mode = getMode(args);
    const isEntrapped = mode == "entrap";

    if (isEntrapped) {
        const entrapment = await getEntrapment() || DEFAULT_ENTRAPMENT;
        displayEntrapment(entrapment);
    }
    await dispatch(args);
    return mode;
}

export const entrapCommand = async (command: string) => {
    const entrapment = await getEntrapment() || DEFAULT_ENTRAPMENT;
    return entrapment.replace("{{command}}", command);
}