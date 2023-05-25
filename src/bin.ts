#!/usr/bin/env node
/* eslint-disable no-console */
import { Command } from "commander";
import { run } from "./run";

const program = new Command();

program
  .option("-d, --dangerous", "DANGEROUS MODE: Run commands written by GPT", false)
  .option("-c, --clear", "clear transcript.")
  .action(run);

program.parse(process.argv);