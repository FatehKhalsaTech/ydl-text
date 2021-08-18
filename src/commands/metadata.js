import { Command, program } from "commander";
import { realtimeAP } from "../lib/realtime.js";

program
  .argument('<path>', 'path to file')




program.parse(process.argv)