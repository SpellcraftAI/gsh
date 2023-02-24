import { log, style } from "@tsmodule/log";

export const trimLinePrefixes = (shellText: string) => shellText?.trim().split("\n").map(
    (line: string) => line.replace(/^\$ /, "")
).join("\n");

export const promptStyle = ` ${style("$", ["bold", "dim"])} `;


const displayEntrapmentSeparator = () => log('\n-- [Entrapment] --\n', ["bold", "red", "underline"]);

export const displayEntrapment = (entrapment: string) => {
    displayEntrapmentSeparator();
    log(`${entrapment}`, ["dim", "red"]);
    displayEntrapmentSeparator();
}

export const displayHelp = () => {
    displayDimmed(`
    Usage: gsh [options] \n
    available options: \n
    --dry-mode: run in dry-mode, no command will be executed. \n
    --entrap: experimental feature. This will try to simulate a remote SSH session. Change the entrapment on ~/.gsh/entrapment.txt to test different sessions.\n
    --clear: clear transcript and entrapped log. \n
    --debug: display the entrapment. \n
    --help: display this help. \n
    `);
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

export const displayOutput = (message: string, isDimmed: boolean) => {
    if (!isDimmed) {
        displayPrompt(message)
    }

    isDimmed && displayDimmed(message);
}