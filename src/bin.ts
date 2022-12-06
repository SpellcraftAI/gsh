#!/usr/bin/env node
/* eslint-disable no-console */
import { clear, error, log, style } from "@tsmodule/log";
import { AUTH0_CLIENT } from "./globs/node";
import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";
import { DOMAIN_URL, PLATFORM } from "./globs/shared";
import { appendToTranscript, getTranscript } from "./utils/filesystem";

const authorized = await AUTH0_CLIENT.isAuthorized();
if (!authorized) {
  error("You are not logged in.", [], { postLines: 1 });

  log("Use UPG to log in using `upg login`:", ["dim"]);
  log("https://gptlabs.us/upg", ["underline"]);

  process.exit(1);
}

const rl = createInterface({
  input: stdin,
  output: stdout,
});

rl.on("SIGINT", () => {
  process.exit(1);
});

clear({ flush: true });

while (true) {
  const transcript = await getTranscript();
  const command = await rl.question(` ${style("$", ["bold", "dim"])} `);
  // console.log({ transcript });
  console.log();
  // console.log(style(command, ["dim"]));

  const { native } = await AUTH0_CLIENT.fetch(
    `${DOMAIN_URL}/api/gsh/shell`,
    {
      method: "POST",
      body: new URLSearchParams({
        command,
        platform: PLATFORM,
        transcript,
      })
    }
  ).then((res) => res.json()) as any;

  console.log(style(native, ["dim"]));
  console.log();

  await appendToTranscript(command, native);
}
