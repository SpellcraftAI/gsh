import { style } from "@tsmodule/log";
import { readFile } from "fs/promises";
import { VERSION } from "../globs/shared";

export const displayLogoAndVersion = async () => {

    const logoPath = new URL("./header.txt", import.meta.url);
    const logoFile = await readFile(logoPath, "utf8");
    const logoText = logoFile.replace("(A version number goes here)", VERSION);

    console.log(style(logoText, ["dim"]));
}