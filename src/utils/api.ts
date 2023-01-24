import { AUTH0_CLIENT } from "../globs/node";
import { error, log } from "@tsmodule/log";

export async function checkAuth() {
    const authorized = await AUTH0_CLIENT.isAuthorized();
    if (!authorized) {
    error("You are not logged in.", [], { postLines: 1 });

    log("Use UPG to log in using `upg login`:", ["dim"]);
    log("https://gptlabs.us/upg", ["underline"]);

    process.exit(1);
    }
}